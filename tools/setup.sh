#!/usr/bin/env bash
# One-time setup in a fresh session (run from the repo root): Node deps for the studio + Python deps.
set -e
cd studio
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-audit --no-fund
# Match the Playwright build to a pre-installed Chromium if one exists (cloud sessions), otherwise download Chromium.
if [ -d /opt/pw-browsers ]; then PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-save playwright@1.63.0; else npx playwright install chromium; fi
cd ..
python3 -m pip install -q numpy scipy 2>/dev/null || python3 -m pip install -q --break-system-packages numpy scipy
python3 studio/tools/doctor.py | sed -n 1,14p
