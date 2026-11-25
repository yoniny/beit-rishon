#!/bin/bash
# Runs a command that launches a browser. At most TWO browsers at once on this machine (2 cores, 7GB): slot 1 or slot 2,
# whichever is free first (polls every 2 s). Long jobs (the final scan) use only slot 2 - see long-browser.sh - so short jobs never wait
# behind them for long.
# Usage: /home/claude/fix/tools/one-browser.sh node shoot.mjs ...
while true; do
  for s in 1 2; do
    exec 9>/tmp/one-browser.slot$s.lock
    if flock -n 9; then "$@"; rc=$?; flock -u 9; exit $rc; fi
  done
  sleep 2
done
