# ALS Watch — Progressive Disclosure Interface

## Core Principle
ALS Watch should not feel like a noisy dashboard. It should feel like a calm guide that reveals more detail only when Scott, Rachel, or the operator needs it.

The default experience should answer:

1. What matters now?
2. Why does it matter?
3. What do we need to know?
4. Who should we ask?
5. Where is the source if we want to verify?

Raw trial data, scoring internals, and long eligibility text should sit behind expansion controls, not dominate the page.

## Disclosure Layers

### Layer 1 — Calm Summary
For Scott/Rachel.

Show only:
- Top 1–3 possible next moves
- Plain-language explanation
- Who should review: Scott / Rachel / doctor / operator
- Status: needs info, ask doctor, watching, not a fit

Example:
> COYA 302 may be worth asking about, but we need Scott’s latest breathing test and ALSFRS-R score before anyone can judge fit.

### Layer 2 — Fit Snapshot
Appears when someone opens a card.

Show:
- Why this came up
- Possible fit / unclear fit / likely not fit
- Main eligibility gates in plain English
- Missing Scott info
- Possible blockers
- Suggested doctor question

No raw clinical wall of text yet.

### Layer 3 — Criteria Details
Expandable.

Show:
- key inclusion criteria
- key exclusion criteria
- location/site details
- coordinator/contact path
- source excerpts

Translate clinical terms beside the original language where useful.

Example:
- Original: `SVC ≥70% predicted`
- Plain English: “This means the trial may require relatively preserved breathing function. We need Scott’s latest breathing test.”

### Layer 4 — Source / Evidence
Deepest layer.

Show:
- ClinicalTrials.gov source link
- raw eligibility excerpt
- last updated date
- sponsor/contact metadata
- scoring reasons
- audit trail / agent notes

This layer is mostly for McDee/operator/doctor packet preparation, not default Scott/Rachel view.

## Page Model

### Home
Default state should be quiet:
- Today’s top move
- Two secondary moves
- Missing info requests
- “Nothing urgent today” state when appropriate

No giant boards by default.

### Trial Card
Collapsed card shows:
- title
- fit status
- plain-language “what this is”
- next step
- source credibility/source type

Expanded card reveals:
1. Fit snapshot
2. Criteria details
3. Source/evidence

### Scott Profile
Show completion gently:
- Known
- Missing
- Optional
- Ask doctor

Avoid making it feel like Scott is failing to fill out a medical form.

### Lead Inbox
Submitted leads should start minimized:
- submitted by
- source/link
- needs review

Only operator view expands into verification/scoring.

### Doctor Packet
Should be the cleanest view:
- short context
- top 1–3 trials/questions
- missing medical facts needed to assess fit
- source links

## Translation Requirement
Every medical/clinical term that affects fit should have a plain-language explanation.

Examples:
- **FVC/SVC:** breathing capacity measurements used by trials to judge respiratory function.
- **ALSFRS-R:** a functional rating scale for daily abilities in ALS.
- **Symptom onset window:** many trials require symptoms to have started within a certain number of months.
- **Genetic mutation requirement:** some trials only apply to people with specific ALS-related mutations like SOD1 or C9orf72.
- **Stable medication period:** some trials require current ALS meds to be unchanged for a set time before screening.
- **Exclusion criteria:** reasons a person may not be allowed into the trial.

## Design Rule
The UI should always prefer:

**plain answer → short reason → next step → expandable details → source**

over:

**raw source → dense criteria → scoring → interpretation**

## Anti-Patterns
Avoid:
- dashboard full of cards on first load
- red urgency everywhere
- raw ClinicalTrials.gov text as the primary view
- pretending the system can determine eligibility
- showing every trial equally
- making Scott/Rachel manage research operations

## Success Feeling
Scott and Rachel should feel:
- less overwhelmed
- clearer about what matters
- safer because claims are sourced and caveated
- able to bring better questions to doctors

McDee/operator should feel:
- the machine is hunting aggressively
- the interface is filtering responsibly
- every lead has fit, criteria, and path to consideration
