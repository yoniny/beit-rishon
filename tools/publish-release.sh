#!/bin/sh
# tools/publish-release.sh — the two steps of every release that are not the store's (UPDATE_DOWNLOAD_210, 14.11.2026).
# The user: "בודאי מה חשבת לעצמך? זה נועד לעזור לאנשים שאין להם אוצריא ומשתמשים רק בקובץ הזה"; on the GitHub release: "בוודאי",
# "רק שיעודכן כל פעם מחדש, תכניס ל-MD" (unified/DEV_NOTES.md, "סדר הפרסום").
#
#   sh tools/publish-release.sh html    <version> <standalone.html>
#       the branch "html" of yoniny/beit-rishon: ONE commit with beit-hamikdash.html and version.txt (version, size in bytes, SHA-256),
#       force-pushed - the update button of the single HTML file (unified/update-check.js) reads both from raw.githubusercontent.com.
#       Run it BEFORE main is pushed.
#       (and the same file under its versioned Hebrew name - one blob - for README.md's link)
#   sh tools/publish-release.sh release <version> <standalone.html> <file.otzplugin> <notes.md>
#       NOTE (14.11.2026): from Claude's session GitHub refuses releases ("HTTP 403: Creating, editing, or deleting releases is not
#       permitted for this session type") - README.md links to the branch html instead; the step is kept for a session that may.
#       the GitHub release v<version>, marked "latest", with beit-hamikdash-<version>.html and beit-hamikdash-<version>.otzplugin (ASCII
#       names: GitHub mangles others; the version in the name - the user: "תוסיף לשם הHTML את שם הגרסה"). README.md, written anew at
#       every release, links to releases/download/v<version>/beit-hamikdash-<version>.html. Run it AFTER main is pushed (the tag is made
#       on main). Run again, it replaces the files and the notes.
set -e
REPO=yoniny/beit-rishon
DIR="${REPO_DIR:-/home/claude/beit-rishon}"
TRAILER="Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ERwCz1T6knu6c9Ybje5GoL"
cmd="$1"; VER="$2"; HTML="$3"
echo "$VER" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$' || { echo "bad version: $VER"; exit 1; }
[ -f "$HTML" ] || { echo "no file: $HTML"; exit 1; }
grep -q "$VER" "$HTML" || { echo "the file does not carry the version $VER"; exit 1; }
T=$(mktemp -d)
cp "$HTML" "$T/beit-hamikdash.html"
SIZE=$(stat -c %s "$T/beit-hamikdash.html")
SHA=$(sha256sum "$T/beit-hamikdash.html" | cut -d' ' -f1)
case "$cmd" in
  html)
    printf '%s\n%s\n%s\n' "$VER" "$SIZE" "$SHA" > "$T/version.txt"
    cd "$DIR"
    H1=$(git hash-object -w "$T/beit-hamikdash.html")
    H2=$(git hash-object -w "$T/version.txt")
    # the same file under its versioned name too (one blob, two names), for README.md's download link (the user: "תוסיף לשם הHTML את שם
    # הגרסה"): GitHub's download button keeps the file's name
    NAME="בית המקדש - לצפייה בלי אוצריא - גרסה $VER.html"
    TREE=$(printf '100644 blob %s\tbeit-hamikdash.html\n100644 blob %s\tversion.txt\n100644 blob %s\t%s\n' "$H1" "$H2" "$H1" "$NAME" | git mktree)
    C=$(git commit-tree "$TREE" -m "html $VER — הקובץ לצפייה בלי אוצריא, לכפתור ״בדיקת עדכונים״" -m "$TRAILER")
    git push -f origin "$C:refs/heads/html"
    # the check: what the button will read (a query string passes the cache of raw.githubusercontent.com)
    sleep 3
    GOT=$(curl -sS "https://raw.githubusercontent.com/$REPO/html/version.txt?t=$(date +%s)")
    [ "$(echo "$GOT" | head -1)" = "$VER" ] || { echo "version.txt on GitHub: $GOT"; exit 1; }
    curl -sS -o "$T/back.html" "https://raw.githubusercontent.com/$REPO/html/beit-hamikdash.html?t=$(date +%s)"
    [ "$(sha256sum "$T/back.html" | cut -d' ' -f1)" = "$SHA" ] || { echo "the file on GitHub differs"; exit 1; }
    echo "html: $VER ($SIZE bytes, $SHA) - OK"
    ;;
  release)
    PKG="$4"; NOTES="$5"
    [ -f "$PKG" ] && [ -f "$NOTES" ] || { echo "usage: release <version> <html> <otzplugin> <notes.md>"; exit 1; }
    cp "$PKG" "$T/beit-hamikdash-$VER.otzplugin"
    cp "$T/beit-hamikdash.html" "$T/beit-hamikdash-$VER.html"
    cd "$DIR"
    if gh release view "v$VER" --repo "$REPO" >/dev/null 2>&1; then
      gh release upload "v$VER" --repo "$REPO" --clobber "$T/beit-hamikdash-$VER.html" "$T/beit-hamikdash-$VER.otzplugin"
      gh release edit "v$VER" --repo "$REPO" --title "בית המקדש $VER" --notes-file "$NOTES" --latest
    else
      gh release create "v$VER" --repo "$REPO" --target main --title "בית המקדש $VER" --notes-file "$NOTES" --latest \
        "$T/beit-hamikdash-$VER.html" "$T/beit-hamikdash-$VER.otzplugin"
    fi
    L=$(gh api "repos/$REPO/releases/latest" --jq .tag_name)
    [ "$L" = "v$VER" ] || { echo "latest release is $L"; exit 1; }
    N=$(gh api "repos/$REPO/releases/latest" --jq "[.assets[] | select(.name==\"beit-hamikdash-$VER.html\") | .size] | .[0]")
    [ "$N" = "$SIZE" ] || { echo "the release's file: $N bytes, expected $SIZE"; exit 1; }
    echo "release: v$VER latest, beit-hamikdash-$VER.html $SIZE bytes - OK"
    ;;
  *) echo "usage: publish-release.sh html|release ..."; exit 1 ;;
esac
rm -rf "$T"
