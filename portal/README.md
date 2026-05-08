# ALS Watch Portal

Canonical private portal prototype promoted from the Claude design export.

Run locally:

```bash
cd /Users/mcdee/Projects/als-watch
python3 -m http.server 8787 --directory portal
```

Open:
`http://127.0.0.1:8787/`

Notes:
- Standalone React/Babel prototype; no build step required.
- Uses mock data in `data.jsx`.
- Do not enter real patient data yet.
- Do not deploy publicly.
