#!/bin/bash
# For LONG browser jobs only (the final scan's views): slot 2 only, so slot 1 stays free for the agents' short shots.
exec 9>/tmp/one-browser.slot2.lock
flock 9
"$@"; rc=$?
flock -u 9; exit $rc
