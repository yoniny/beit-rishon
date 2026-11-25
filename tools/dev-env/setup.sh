#!/bin/bash
# Recreates the work environment of the 4.5.0 round in a fresh container (the scripts use absolute paths).
# Usage (from the clone's root): bash tools/dev-env/setup.sh
set -e
R=$(cd "$(dirname "$0")/../.." && pwd); D="$R/tools/dev-env"
cd "$R" && npm install --no-audit --no-fund >/dev/null 2>&1 || npm install
mkdir -p /home/claude/fix /home/claude/split/watch /home/claude/probe/se /home/claude/fix/tools
[ -e /home/claude/fix/rel ] || ln -s "$R" /home/claude/fix/rel            # the builds and the scan expect /home/claude/fix/rel
[ -e /home/claude/split/base ] || ln -s "$R" /home/claude/split/base      # watch-lib requires puppeteer-core from here
cp "$D/watch-lib.mjs" /home/claude/split/watch/lib.mjs                     # tools/scan/lib.mjs imports it by this path
cp "$D"/one-browser.sh "$D"/long-browser.sh "$D"/scan-resume.sh /home/claude/fix/tools/ 2>/dev/null || true
cp "$D"/fullbuild.sh "$D"/timbuild.sh "$D"/timing.py /tmp/
cp "$D"/probes/*.mjs /home/claude/probe/se/
chmod +x /home/claude/fix/tools/*.sh /tmp/fullbuild.sh /tmp/timbuild.sh
echo "ready. Chrome: ${CHROME:-/usr/bin/google-chrome} $( (${CHROME:-/usr/bin/google-chrome} --version) 2>/dev/null || echo MISSING - set CHROME=...)"
echo "build: bash /tmp/fullbuild.sh unified-NN   |   probes: cd /home/claude/probe/se && bash /home/claude/fix/tools/one-browser.sh node <probe>.mjs <plugin dir> ..."
