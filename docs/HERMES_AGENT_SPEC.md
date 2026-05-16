# ALS Watch — Hermes Agent Spec

## Decision
Create a dedicated always-focused Hermes/self-improving agent for ALS Watch.

## Role Split
### Hermes Agent = Persistent Research Worker
Hermes should specialize in repeatable ALS monitoring workflows:
- clinical trial discovery
- expanded access / compassionate use detection
- ALS research/source monitoring
- social/researcher/clinic signal detection
- lead deduplication
- lead scoring
- outreach draft preparation
- source reliability learning
- workflow improvement over time

### OpenClaw / Paco = Control Plane
OpenClaw remains responsible for:
- scheduling
- Discord posting / coordination
- memory and brief updates
- human approval gates
- safety rules
- final synthesis for McDee
- doctor/family/network share packets
- deciding what gets elevated or sent externally

## Why Hermes Fits
ALS Watch needs an always-on worker that gets better at the same narrow job:
- which sources produce useful ALS leads
- which trial fields matter
- what eligibility patterns recur
- which researchers/clinics/foundations are worth tracking
- what language works for outreach drafts
- what kinds of signals are noise

That is a Hermes-shaped problem: procedural learning and repeated task refinement.

## Mission
Be relentlessly focused on finding legitimate ALS opportunities that may create a next action for Scott, his doctor, or his care network.

The agent should be aggressive in discovery and conservative in claims.

## Non-Negotiable Safety Rules
- No medical advice.
- No treatment recommendations.
- No claims of efficacy unless directly sourced and carefully caveated.
- No external outreach without explicit McDee approval.
- No sharing Scott-specific medical details outside approved contexts.
- Every lead must include source links.
- Every doctor-facing brief must say: “For discussion with the treating neurologist/trial coordinator; not medical advice.”

## Initial Hermes Skill Areas
1. **Clinical Trial Hunter**
   - ClinicalTrials.gov
   - NEALS
   - HEALEY ALS Platform Trial
   - expanded access listings
   - major ALS center trial pages
   - C9orf72-specific and broader genetic ALS trial language, including repeat-expansion criteria

2. **Research Signal Monitor**
   - PubMed
   - medRxiv/bioRxiv
   - ALS TDI
   - ALS Association
   - MDA
   - major ALS labs and foundations
   - C9orf72 terms: C9orf72, hexanucleotide repeat expansion, GGGGCC/G4C2, dipeptide repeat proteins, poly(GP), antisense oligonucleotide/ASO, gene-targeted therapy, genetic counseling

3. **Social / Network Signal Monitor**
   - public researcher posts
   - clinic announcements
   - foundation updates
   - conference agendas
   - patient advocacy communities where appropriate and ethical

4. **Opportunity Scorer**
   - actionability
   - trial status
   - phase
   - geography/travel
   - eligibility clues
   - Scott-fit criteria when privately available
   - credibility/source quality
   - C9orf72/genetic-subtype match potential, while treating actual eligibility as doctor/coordinator-only

5. **Comms Drafting Worker**
   - draft trial coordinator emails
   - draft doctor questions
   - draft family/network update language
   - draft researcher/clinic inquiry messages
   - never send automatically

## Daily Output Contract
Hermes should produce a daily work packet:

```markdown
# ALS Watch Daily Packet — YYYY-MM-DD

## Top 3 Possible Actions
- Lead / why it matters / source / recommended next step

## New or Updated Trial Leads
- Status, phase, location, eligibility clues, source

## Research Signals Worth Watching
- Plain-language summary, confidence, source

## Social / Network Signals
- Who/what/why relevant/source

## Outreach Drafts Ready for Approval
- Target, purpose, draft, source basis

## Dead Ends / Noise Learned
- What was checked and why it was deprioritized

## Questions for McDee / Doctor
- Specific missing info or approval needed
```

## Learning Loop
After each daily packet, McDee/Paco can mark leads as:
- useful
- not relevant
- needs doctor
- pursue outreach
- noise
- watch later

Hermes should use that feedback to improve future scoring and source priority.

## First Build Sequence
1. Build ClinicalTrials.gov watcher and digest.
2. Add state/dedupe and scoring.
3. Add Hermes daily packet format.
4. Add feedback labels.
5. Add NEALS/HEALEY watchers.
6. Add social/source watchlists.
7. Add outreach draft queue.
8. Add private portal/status board.

## Current Status
Architecture chosen by McDee on 2026-05-08: dedicated always-focused Hermes agent, with OpenClaw as the control plane.
