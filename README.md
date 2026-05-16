# ALS Watch

ALS Watch is an agent-assisted opportunity watch desk for ALS clinical trials, research signals, expanded-access paths, and proactive care-network communications.

It starts Scott-first, but is designed to become doctor-shareable and potentially a broader public-good/nonprofit system.

## Current Mission
Find potentially actionable ALS opportunities aggressively, summarize them clearly, and route them through human review before any outreach or medical interpretation.

## Current Specificity
Scott's watch profile now treats **C9orf72** as a high-priority genetic-subtype signal. The system should elevate C9orf72-specific trials/research and ask for exact genetic-report wording before judging fit. ALS Watch still does not determine eligibility; C9orf72 leads are for doctor/trial-coordinator review.

## Safety Rule
ALS Watch does not provide medical advice. Outputs are for discussion with treating neurologists, trial coordinators, and approved care-network members.

## Initial Build
v0 focuses on ClinicalTrials.gov monitoring and Markdown digest generation.

See:
- `docs/TODAY_PLAN.md`
- `docs/CODEX_BUILD_PROMPT.md`
- `docs/SCOTT_INTAKE_TEMPLATE.md`
- `docs/HERMES_AGENT_SPEC.md`

## v0 CLI

Run the ClinicalTrials.gov watcher:

```bash
python3 -m als_watch.trials --days 7 --out out/digest.md
```

Useful options:

```bash
python3 -m als_watch.trials --days 30 --include-seen --out out/digest.md
python3 -m als_watch.trials --dry-run --out out/digest.md
```

State is stored at `state/clinicaltrials_seen.json` to reduce duplicate alerts.

## Daily Packet CLI

Generate the local daily packet bundle:

```bash
python3 -m als_watch.packet --days 1 --out-dir out
```

This writes:

- `out/digest.md` — full ClinicalTrials.gov digest
- `out/daily-packet.md` — concise operator/Discord-friendly daily packet
- `out/portal-data.json` — structured data for a future portal integration
- `out/portal-update.json` — current daily update for portal display
- `out/portal-update.md` — readable daily update for portal/archive use
- `out/operator-message.md` — short Markdown suitable for an operator notification surface

For a broader review window that includes already-seen leads:

```bash
python3 -m als_watch.packet --days 30 --include-seen --out-dir out
```

The packet generator only writes local files. It does not send Discord/email/SMS messages, contact doctors or trial coordinators, deploy, or use real patient data.

## Smoke Test

```bash
python3 -m pytest tests
```

If pytest is not installed, the CLI can still run with the Python standard library only.

## Current Source

- ClinicalTrials.gov API v2 via `als_watch/trials.py`

Future sources are listed in `sources.md`.
