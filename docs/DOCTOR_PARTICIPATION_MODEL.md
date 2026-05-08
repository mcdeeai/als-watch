# ALS Watch — Doctor Participation Model

## Principle
Doctors should participate through clean, source-backed review packets and low-friction response paths — not by being asked to operate a noisy dashboard.

ALS Watch should make the doctor’s job easier:
- fewer vague questions
- better organized source links
- clear missing facts
- concise fit/criteria/path summaries
- explicit patient/caregiver questions

It must not create extra clinical burden, imply eligibility, or bypass medical judgment.

## Roles

### Scott / Rachel
- decide what personal medical details can be shared
- review plain-language summaries
- bring questions to the clinical team

### McDee / Operator
- triages leads
- prepares doctor packets
- approves any outreach
- tracks responses

### Doctor / ALS Clinic
- reviews selected opportunities
- identifies obvious non-fits or realistic paths
- says what tests/records are needed
- advises whether to contact trial coordinators or refer

### Trial Coordinator
- answers trial-specific screening/referral questions
- confirms site status, remote pre-screening, and required records

## Doctor Participation Levels

### Level 1 — Bring-to-appointment packet
Lowest friction. No doctor login.

A PDF/email packet that Scott/Rachel can bring to UCSF or treating clinician.

Includes:
- 1-page summary
- top 1–3 trial questions
- missing fit data needed
- source links
- short plain-language trial summaries

Best first step.

### Level 2 — Doctor review link
A private read-only link for the doctor/clinic.

Features:
- no account required or magic-link access
- only selected leads, not full research feed
- “Looks worth asking coordinator” / “unlikely fit” / “need more info” response options
- optional comment box

### Level 3 — Structured clinician feedback
A lightweight response form.

Doctor can mark each lead:
- worth pursuing
- not appropriate
- need more patient info
- ask trial coordinator
- discuss at next visit

Doctor can identify missing items:
- FVC/SVC
- ALSFRS-R
- genetic testing
- medication stability
- onset/diagnosis timing
- records needed

### Level 4 — Care-team workspace
Only later, if a clinician actually wants it.

Could include:
- shared doctor question list
- reviewed lead history
- coordinator response tracking
- document upload/review notes

Do not build this first.

## Ideal Doctor Packet Structure

```markdown
# ALS Watch Doctor Review Packet

Patient/caregiver question:
We are trying to understand whether any of these sourced ALS trial leads are realistic enough to pursue or ask coordinators about.

Safety note:
ALS Watch does not provide medical advice and is not assessing eligibility. We are asking for clinician guidance.

## Top Questions
1. Based on Scott’s diagnosis, onset timing, respiratory status, genetics, and current meds, are any of these trials worth pursuing?
2. What patient facts or records are needed before contacting coordinators?
3. Would UCSF/the treating clinic recommend contacting any listed coordinator or referring to another site?

## Trial 1: [Title] ([NCT ID])
Plain-language summary:

Why it surfaced:

Possible fit gates:

Known Scott info:

Missing info:

Possible blockers:

Path to consideration:

Specific question for clinician:

Source:

## Trial 2...
```

## Interface Implications

### For Scott/Rachel view
Add a button:
- “Prepare doctor packet”
- “Add to doctor questions”
- “Mark for next appointment”

### For operator view
Add:
- selected leads for packet
- packet preview
- missing patient info checklist
- draft doctor email
- response tracking

### For doctor link view
Show only:
- concise packet
- source links
- fit gates
- checkboxes/comment field

Hide:
- raw agent scoring unless expanded
- social/research noise
- family lead inbox
- internal outreach drafts
- unverified speculative signals

## Key Safety Boundaries
- No doctor-facing claim that Scott is eligible.
- No automatic sending.
- No pressure language.
- No request for the doctor to “approve” AI output.
- Always frame as: “Can you help us decide whether this is worth asking about?”

## Recommended First Build
Start with Level 1:
- Generate a doctor packet from selected trial cards.
- Export as Markdown/PDF/email draft.
- Include top 3 questions and missing info.

Then add Level 2 only if the doctor/care team seems willing to review links.
