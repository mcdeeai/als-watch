# Codex Prompt — ALS Watch Daily Packet, Discord Output, Portal JSON

Intended lane: Codex
Repo: `/Users/mcdee/Projects/als-watch`

```text
You are working in `/Users/mcdee/Projects/als-watch`.

Goal: implement the next ALS Watch integration layer: turn the ClinicalTrials.gov watcher output into a concise daily packet, a Discord-ready notification text file, and portal-consumable JSON.

Context:
ALS Watch is a private, Scott-first ALS trial/research watch desk. It must be aggressive about finding legitimate opportunities but medically careful. It does not provide medical advice, does not determine eligibility, and must not send outreach automatically.

Current repo state:
- `als_watch/trials.py` fetches ClinicalTrials.gov ALS studies and writes Markdown digests.
- `portal/` contains the promoted Claude prototype using mock data in `portal/data.jsx`.
- `docs/TRIAL_FIT_REVIEW.md` defines the fit / criteria / path-to-consideration standard.
- `docs/PROGRESSIVE_DISCLOSURE_INTERFACE.md` defines the interface model.
- `docs/DOCTOR_PARTICIPATION_MODEL.md` defines doctor packet participation.

Your task:
Build a small, inspectable integration layer that produces three outputs:

1. Full digest markdown
   - existing behavior should continue: `out/digest.md`

2. Daily packet markdown
   - new file: `out/daily-packet.md`
   - should be concise and operator/Discord friendly
   - include:
     - date/time
     - safety note
     - top 3 possible actions
     - new/changed high-priority trial leads
     - missing Scott info blocking fit assessment
     - doctor questions generated from leads
     - links to full source/trial pages

3. Portal data JSON
   - new file: `out/portal-data.json`
   - should contain structured data that can later replace `portal/data.jsx`
   - include:
     - `generatedAt`
     - `topActions`
     - `trials`
     - `missingInfo`
     - `doctorQuestions`
     - `sources`
   - trial objects should include:
     - id / NCT ID
     - title
     - status
     - phase
     - fitStatus or reviewStatus
     - plainSummary
     - nextStep
     - locations
     - contact/pathToConsideration
     - keyFitGates
     - inclusionPlain
     - exclusionPlain
     - missingScottInfo
     - sourceUrl
     - score
     - scoreReasons

4. Discord-ready notification text
   - new file: `out/discord-message.md`
   - plain text/Markdown suitable to paste or post into Discord
   - must be short enough to read in channel
   - should include:
     - “ALS Watch Daily Packet” heading
     - top 3 actions
     - any urgent/new high-priority trial leads
     - missing Scott info
     - link/path to `out/daily-packet.md`
   - Do not actually post to Discord. Just generate the file.

CLI requirements:
Add or extend a command so this works:

```bash
python3 -m als_watch.packet --days 1 --out-dir out
```

It should internally use or import the existing trial watcher logic where practical, not duplicate everything.

Also support:

```bash
python3 -m als_watch.packet --days 30 --include-seen --out-dir out
```

Safety requirements:
- Do not send email/SMS/Discord messages.
- Do not contact doctors, clinics, coordinators, or Scott/Rachel.
- Do not imply eligibility.
- Use language like “possible lead,” “ask doctor,” “needs missing info,” “path to consideration.”
- Include the standard safety note in generated packet files.

Quality requirements:
- Keep code simple and stdlib-only if possible.
- Add/adjust smoke tests that do not require network.
- Preserve existing CLI behavior.
- Avoid committing generated `out/` files if ignored.
- Do not deploy.
- Do not mutate real patient data.

Implementation hints:
- Create `als_watch/packet.py`.
- Reuse `TrialLead`, `fetch_studies`, `normalize_study`, `filter_recent_or_changed`, and `render_digest` from `als_watch.trials`.
- Add helper functions for:
  - `lead_to_portal_trial(lead)`
  - `infer_missing_info(lead)`
  - `build_top_actions(leads)`
  - `build_doctor_questions(leads)`
  - `render_daily_packet(packet)`
  - `render_discord_message(packet)`
- For v0, heuristic translation is acceptable. Focus on usefulness and clarity over medical perfection.

Definition of done:
- `python3 -m als_watch.packet --days 30 --include-seen --out-dir out` runs successfully.
- It writes:
  - `out/digest.md`
  - `out/daily-packet.md`
  - `out/portal-data.json`
  - `out/discord-message.md`
- Tests or manual smoke tests pass.
- README documents the new packet command.
- Report files changed, commands run, and any limitations.
```
