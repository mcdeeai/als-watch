# ALS Watch — Current State and Next Steps

Last updated: 2026-05-08

## Current intent
ALS Watch is an AI-assisted ALS opportunity desk for Scott and Rachel.

The goal is not to build a generic medical dashboard or an AI doctor. The goal is to use AI to monitor the latest ALS-related information, filter noise, translate what matters into plain language, and help Scott/Rachel take the right next step with doctors and trusted network support when something could be relevant.

North star:
If there is a legitimate ALS opportunity somewhere in the system, ALS Watch should help Scott and Rachel know about it, understand it, and take the right next step in time.

## Current live review prototype
Public review URL:
https://mcdeeai.github.io/als-watch/

Repo:
https://github.com/mcdeeai/als-watch

Local repo:
```bash
cd /Users/mcdee/Projects/als-watch
```

## What exists now

### 1. Public review portal
- GitHub Pages deploys from `portal/`.
- Mobile-optimized enough for review.
- Default landing page is **Mission**.
- Includes:
  - Mission / intent
  - Today
  - Daily updates
  - Trials & leads
  - Scott fit profile
  - Ask the doctor
  - Lead inbox
  - Research watch
  - Operator-only outreach queue

### 2. Daily update automation
GitHub Actions workflow:
`.github/workflows/pages.yml`

Runs:
```bash
python3 -m als_watch.packet --days 30 --include-seen --out-dir out --dry-run
```

Then writes:
- `portal/generated/portal-update.js`
- `portal/generated/portal-update.json`

The portal Daily Updates page reads from `window.ALSPortalUpdate`.

Scheduled refresh:
- GitHub Actions cron currently set to `20 13 * * *` UTC, roughly 6:20am Pacific during PDT.

### 3. Packet generator
Main file:
`als_watch/packet.py`

Outputs:
- `out/digest.md`
- `out/daily-packet.md`
- `out/portal-data.json`
- `out/portal-update.json`
- `out/portal-update.md`
- `out/operator-message.md`

Important safety state:
- No emails sent.
- No Discord messages sent.
- No SMS.
- No doctor/coordinator outreach.
- No real patient data in the public prototype.
- Core ALS filtering exists to reduce sidebar-condition false positives.

## What today's iteration accomplished
- Clarified the actual product intent: watch → filter → translate → assess fit → identify missing info → prepare doctor questions → mobilize network.
- Promoted the Claude-designed prototype into the canonical `portal/`.
- Published the review prototype to GitHub Pages.
- Added mobile optimization.
- Added Mission page.
- Added early-stage development plan directly into the portal.
- Added a Daily Updates page backed by generated watcher data.
- Added GitHub Actions automation so the portal refreshes daily.

## Known limitations

### Output is still too machine-like
Examples:
- “Reviewed 980 selected ClinicalTrials.gov record(s)” is technically true but not ideal for Scott/Rachel.
- Need softer language: “ALS Watch scanned the trial registry and found 3 ALS-focused leads worth doctor review.”

### Daily updates are not yet truly delta-aware
Current run includes a 30-day include-seen window. Useful for review, but not a true “new since yesterday” digest.

Need:
- new today
- changed since last run
- already on watchlist
- archived/noise

### Fit review is still shallow
Current matching uses heuristics and missing-info inference.

Need stronger extraction of:
- onset window
- ALSFRS-R requirements
- FVC/SVC requirements
- genetics requirements
- medication stability
- ventilation exclusions
- location/site feasibility
- coordinator/contact path

### Portal data is partly mock, partly generated
Daily Updates uses generated data. Other pages still use static `data.jsx` mock content.

Need to progressively connect:
- Trials & leads
- Ask the doctor
- Scott fit profile missing-info prompts
- Doctor packet

### Public review site is not private
Okay for prototype review, not okay for real Scott medical data.

Before real patient data:
- private hosting/auth
- separate public prototype from private care portal
- data handling rules

## Recommended next session plan

### Step 1 — Polish daily update language
Goal: make Daily Updates feel human and calm.

Change packet status from raw counts to:
- “ALS Watch scanned the trial registry today.”
- “3 ALS-focused leads are worth doctor review.”
- “Nothing has been sent externally.”
- “Main blocker: Scott-specific fit information is still missing.”

Files:
- `als_watch/packet.py`
- `portal/screens.jsx` if display needs adjustment

### Step 2 — Add delta/watchlist model
Goal: stop treating every run as a giant first scan.

Add categories:
- New since last run
- Changed since last run
- Still watching
- Needs doctor review
- Archived/noise

Likely files:
- `state/clinicaltrials_seen.json`
- new `state/watchlist.json` or `out/watchlist.json`
- `als_watch/packet.py`

### Step 3 — Improve trial fit extraction
Goal: make each lead show why it matters and what blocks action.

Extract/normalize:
- onset window
- ALSFRS-R
- FVC/SVC
- genetics
- current meds
- ventilation/tracheostomy
- geography/contact path

Output should support portal cards and doctor packets.

### Step 4 — Connect Trials & Leads page to generated data
Goal: reduce mock/static content.

Options:
- Generate `portal/generated/portal-data.js` from `out/portal-data.json`.
- Teach `ScreenTrials` to use generated trials if available.
- Keep fallback mock data for local prototype safety.

### Step 5 — Doctor packet v1
Goal: one-click “prepare doctor packet” from top leads.

Packet should include:
- patient/caregiver question
- top 1–3 leads
- fit gates
- missing Scott info
- specific doctor questions
- source links
- safety note

No sending. Export/display only.

### Step 6 — Network mobilization model
Goal: once a lead is actionable, identify who could help.

Track:
- relevant institution
- PI/coordinator
- clinic/site
- foundation/advocacy org
- possible warm intro
- recommended ask
- owner: Rachel / McDee / doctor / care network

This should remain dormant until a lead is actually worth mobilizing.

## Suggested next prompt

```text
In /Users/mcdee/Projects/als-watch, continue ALS Watch Phase 2.

Goal: improve Daily Updates from a first-scan machine report into a calm, human review update, and prepare the data model for new/changed/watchlist categories.

Start by reading docs/NEXT-STEPS.md, als_watch/packet.py, portal/screens.jsx, and .github/workflows/pages.yml.

Do not send messages, do not contact anyone, do not add real patient data, and do not deploy outside the existing GitHub Pages workflow.

Focus first on:
1. Softer Daily Updates language.
2. Clear separation of “new/changed” vs “already watching” if feasible.
3. Keep the current CLI and Pages workflow working.
4. Run compile/smoke checks.
5. Push only when verified.
```
