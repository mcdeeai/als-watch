# Codex / Factory Droid Build Prompt — ALS Watch v0

You are building ALS Watch v0, a focused clinical-trial opportunity watcher for ALS.

## Context
ALS Watch is being created for a real person with ALS. It must be aggressive about finding opportunities, but medically careful. It does not provide medical advice. It produces sourced intelligence for human review and doctor discussion.

## Repo
Create or use:
`/Users/mcdee/Projects/als-watch`

## Goal
Build a working Python CLI that queries ClinicalTrials.gov API v2 for ALS-related studies, detects new/updated relevant opportunities, stores seen state locally, and writes a concise Markdown digest.

## Definition of Done
- `python -m als_watch.trials --days 7 --out out/digest.md` works.
- Creates local state file/database to prevent duplicate alerts.
- Produces a Markdown digest with source links.
- Includes a safety disclaimer.
- Has basic tests or at least a smoke test command.
- README explains setup and usage.

## Data Source
ClinicalTrials.gov API v2:
`https://clinicaltrials.gov/api/v2/studies`

Search globally. Do not restrict to UCSF/Bay Area. UCSF may be noted later as a care anchor, but any legitimate opportunity anywhere should surface.

Suggested queries:
- condition: `Amyotrophic Lateral Sclerosis`
- also consider `ALS`
- statuses: recruiting, not yet recruiting, active not recruiting, enrolling by invitation, available expanded access if present
- updated within configurable days if API supports it cleanly

## Extract Fields
For each study, extract as available:
- NCT ID
- brief title
- official title
- overall status
- phase
- interventions
- sponsor/collaborators
- conditions
- eligibility criteria excerpt
- locations: facility, city, state, country
- contacts if public
- last update/post date
- study URL

## Scoring
Implement a simple transparent actionability score, not a black box.

Suggested factors:
- Recruiting / not yet recruiting > active not recruiting
- Phase 2/3 > Phase 1 for direct opportunity, but Phase 1 still relevant
- Interventional > observational, but observational may be useful
- Has US locations/contact info
- Recently updated
- Mentions expanded access or treatment/intervention
- Elevate C9orf72/genetic-subtype signals, but never treat them as fit without the exact genetic report and doctor/coordinator review.

Output score and short rationale.

## Digest Format
Markdown sections:
1. Header/date
2. Safety note: not medical advice; discuss with neurologist/trial coordinator
3. Top actionable leads
4. Other new/updated trials worth watching
5. Low-confidence/no-action items if any
6. Raw source links

Each lead:
- title + NCT ID
- status/phase
- why it matters
- location summary
- eligibility clues
- actionability score/rationale
- source link
- suggested question for doctor/coordinator

For C9orf72-specific leads, include a doctor/coordinator question about whether Scott's exact genetic report wording matches the study criteria and what documentation is needed for pre-screening.

## Constraints
- Do not send emails/SMS/social posts.
- Do not contact anyone.
- Do not imply medical recommendation.
- Do not use “breakthrough” unless quoting a source with attribution.
- Keep implementation simple and inspectable.

## Nice to Have
- `config/scott.criteria.example.json` with empty optional fields:
  - state
  - travel radius
  - age range
  - diagnosis date
  - genetic subtype
  - clinic/doctor
- `sources.md` listing future sources: NEALS, HEALEY ALS Platform Trial, ALS Association, ALS TDI, PubMed, medRxiv/bioRxiv, relevant social/research feeds.

## Report Back
When done, provide:
- files created
- exact commands run
- sample digest path
- any API limitations or fields missing
- next recommended step
