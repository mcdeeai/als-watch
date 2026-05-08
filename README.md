# ALS Watch

ALS Watch is an agent-assisted opportunity watch desk for ALS clinical trials, research signals, expanded-access paths, and proactive care-network communications.

It starts Scott-first, but is designed to become doctor-shareable and potentially a broader public-good/nonprofit system.

## Current Mission
Find potentially actionable ALS opportunities aggressively, summarize them clearly, and route them through human review before any outreach or medical interpretation.

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

## Smoke Test

```bash
python3 -m pytest tests
```

If pytest is not installed, the CLI can still run with the Python standard library only.

## Current Source

- ClinicalTrials.gov API v2 via `als_watch/trials.py`

Future sources are listed in `sources.md`.

