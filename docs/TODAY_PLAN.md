# ALS Watch — Today Plan

Date: 2026-05-08
Channel: #als-notification-system

## Mission
Create the first working version of ALS Watch today: an agent-assisted ALS opportunity watch desk that aggressively finds potentially actionable clinical trial/research opportunities, summarizes them, and posts a clean reviewable digest into Discord.

This is not medical advice. It is sourced opportunity intelligence for McDee/humans to review and, when appropriate, discuss with Scott's doctor/care network.

## Product Shape
ALS Watch = agent research desk + private comms/control surface + human care network.

Today we build the research desk foundation, not the whole portal.


## Trial Fit Standard
Every trial lead must eventually answer:
- fit: could this plausibly apply to Scott?
- criteria: what inclusion/exclusion gates matter?
- path: how does Scott get considered?

See `docs/TRIAL_FIT_REVIEW.md`.

## Today’s Definition of Done
1. Repo/folder scaffold exists.
2. ClinicalTrials.gov v2 watcher works for ALS.
3. It stores seen studies locally to avoid duplicate alerts.
4. It produces a concise Markdown digest of new/updated relevant studies.
5. It can be run manually from the terminal.
6. It is ready to be wired to OpenClaw cron / Discord posting.
7. Source links and safety disclaimer are included.

## v0 Scope
### Must have today
- ClinicalTrials.gov search for ALS / amyotrophic lateral sclerosis.
- Global search, not UCSF-only.
- Highlight recruiting / not-yet-recruiting / active trials.
- Extract:
  - NCT ID
  - title
  - status
  - phase
  - interventions
  - sponsor
  - location countries/states/cities where available
  - eligibility excerpt if available
  - last update date
  - source URL
- Score actionability:
  - recruiting status
  - phase
  - intervention/treatment relevance
  - location/travel relevance if known
  - novelty/update recency
- Generate top leads first.

### Nice to have today
- NEALS / HEALEY source stubs.
- Simple lead inbox JSON.
- Doctor-brief export format.
- Config file for Scott criteria, initially empty/private.

### Not today
- Public portal.
- SMS.
- Automated external outreach.
- Medical recommendations.
- Complex AI fine-tuning.

## Safety / Trust Rules
- Never claim treatment efficacy.
- Never say “breakthrough” unless quoting a source and clearly labeling it.
- Every item must link to a source.
- Always include: “Not medical advice; discuss with neurologist/trial coordinator.”
- No outreach to Scott, clinicians, researchers, clinics, or social channels without McDee approval.

## Recommended Build Lane
Use Codex or Factory Droid for the coding scaffold. Use OpenClaw/Paco as director/reviewer.

Preferred today:
- Codex for clean Python implementation and tests.
- Factory Droid if McDee wants an autonomous mission-style build.
- AmpCode if using an interactive code loop.

## Proposed Folder
`/Users/mcdee/Projects/als-watch`

## Proposed Stack
- Python 3.11+
- requests/httpx
- pydantic optional
- SQLite or JSON state
- Markdown output
- pytest smoke tests

## CLI Shape
```bash
cd /Users/mcdee/Projects/als-watch
python -m als_watch.trials --days 7 --out out/digest.md
```

Optional later:
```bash
python -m als_watch.trials --days 1 --post-discord
python -m als_watch.digest --weekly
```

## OpenClaw Cron Later
Daily morning run:
- run watcher
- if digest has new actionable leads, post into #als-notification-system
- if nothing new, optionally post quiet weekly rollup only

## Next Portal Shape
After v0 watcher works:
- private board with lead statuses
- lead inbox for friends/family
- doctor questions list
- outreach queue
- role-based invites

## First Human Inputs Needed Eventually
Do not block v0 on these:
- Scott’s state / travel tolerance
- age range
- diagnosis date or disease duration
- genetic subtype if known
- current ALS clinic/doctor context
- respiratory/FVC if known
- current meds if relevant
