# ALS Watch Private Portal — Interface Design Prompt

Intended lane/tool: prototyping agent, Lovable/v0/Bolt/Replit/AmpCode, or any UI design/build agent.

```text
You are designing the first private interface for ALS Watch.

PROJECT CONTEXT
ALS Watch is a private, Scott-first care-network portal for tracking ALS clinical trials, research leads, expanded-access possibilities, doctor questions, and outreach steps.

It is for Scott, who has ALS, and Rachel, his wife, plus a small trusted network. It must feel calm, practical, respectful, and emotionally steady. It is not a medical app, not a social forum, not a public dashboard, and not a place for hype.

Core mission:
Help Scott, Rachel, and trusted helpers understand what possible ALS opportunities exist, what might fit Scott, what information is still missing, and what the next doctor/coordinator question should be.

Tone:
- calm
- clear
- human
- hopeful without false hope
- private and respectful
- no hospital-billing vibes
- no crypto/dashboard bro vibes
- no “breakthrough” hype
- no overwhelming data tables as the primary experience

Guiding phrase:
AI should not manufacture false hope; it should reduce the distance between people and legitimate hope.

USERS
1. Scott
   Needs a low-stress, readable view of what matters now.
   Should not be overwhelmed by raw research or technical jargon.

2. Rachel
   Needs situational awareness, action items, questions for doctors, and a place to add context/leads.

3. McDee / operator
   Needs deeper control: triage leads, approve outreach drafts, edit status, mark useful/noise, prepare doctor packets.

4. Trusted friends/family
   Need a simple way to submit leads, contacts, articles, trial pages, or notes without interpreting them medically.

5. Doctors / clinic staff later
   Need clean sourced packets, not raw AI noise.

PRIMARY INFORMATION ARCHITECTURE
Design a private web portal with these main sections:

1. Today
- Top 3 possible actions
- Each action should show:
  - title
  - why it matters
  - who should review it: Scott/Rachel/doctor/operator
  - next step
  - source link
  - safety caveat when appropriate

2. Trials & Leads Board
A status board for opportunities:
- New lead
- Needs Scott info
- Needs doctor review
- Coordinator/contact path identified
- Pursuing / awaiting reply
- Watching
- Not a fit / archived

Each trial card should include:
- trial title
- NCT/source ID
- status/phase
- fit status
- score/confidence if available
- locations
- key inclusion criteria
- key exclusion criteria
- missing Scott info
- how to get considered
- doctor/coordinator question
- source link

Important: “Found trial” is not enough. The UI must center fit, criteria, and path to consideration.

3. Scott Fit Profile
A private checklist/status page showing which matching fields are known vs missing:
- location/travel willingness
- diagnosis date
- symptom onset date
- site of onset
- genetic testing status / mutation if known
- ALSFRS-R if known
- FVC/SVC respiratory measure if known
- current ALS meds
- prior/current trial participation
- mobility/speech/swallowing/respiratory notes if Scott chooses to share
- treating ALS clinic / neurologist

This page should be gentle. Use “Known / Missing / Optional / Ask doctor” instead of making it feel like a medical interrogation.

4. Ask the Doctor
A clean list of questions to bring to UCSF / treating neurologist / ALS clinic.
Each question should link back to the trial or lead that generated it.
Include an export/share packet concept.

5. Lead Inbox
Simple form for Rachel/friends/family:
- link/contact/article/trial page
- why they think it may matter
- who submitted it
- optional note
Submission should go to review, not directly to Scott as truth.

6. Outreach Queue
For operator view:
- draft emails/messages to trial coordinators, doctors, researchers, clinics
- status: draft / needs approval / approved / sent / reply received / closed
- HARD RULE: nothing external is sent automatically

7. Research Watch
Lower-pressure section for research papers, AI/drug-discovery signals, expanded-access signals, foundation updates, and social/researcher announcements.
Clearly separate “interesting research” from “actionable trial opportunity.”

VISUAL DESIGN DIRECTION
Design language:
- warm paper / quiet clinical / humane command center
- soft off-white background
- deep green or blue as primary trust color
- restrained amber for watch items
- muted red only for blockers/urgent caveats
- generous spacing
- large readable typography
- card-based but not SaaS-generic
- accessible contrast
- mobile-friendly

Avoid:
- dense tables as default
- dark cyber dashboards
- hype gradients
- fake medical authority
- charts that imply precision we do not have


PROGRESSIVE DISCLOSURE REQUIREMENT
The interface should not be a noisy dashboard. It should use progressive disclosure:

Layer 1: calm summary / top next moves for Scott and Rachel.
Layer 2: plain-language fit snapshot.
Layer 3: criteria details and missing Scott info.
Layer 4: raw source/evidence/scoring for operator or doctor-packet preparation.

Default view should be quiet and action-oriented. Hide raw clinical text, scoring internals, and long eligibility criteria behind expansion controls. Use this order everywhere:
plain answer → short reason → next step → expandable details → source.

Every medical term that affects trial fit should include a plain-language explanation. Examples: FVC/SVC, ALSFRS-R, symptom onset window, genetic mutation requirement, stable medication period, exclusion criteria.

See `docs/PROGRESSIVE_DISCLOSURE_INTERFACE.md` for the interface doctrine.

KEY UX PRINCIPLES
- Start with the next practical action, not the data dump.
- Every claim should have a source link.
- Every lead should show uncertainty clearly.
- Use labels like “possible fit,” “needs doctor review,” “missing info,” “watch only.”
- Make it easy for Scott/Rachel to answer missing-info questions without feeling burdened.
- Separate private medical details from public/source data.
- Make the operator layer more detailed than Scott/Rachel’s layer.

SAFETY LANGUAGE
Include persistent but non-alarming safety copy:
“ALS Watch does not provide medical advice. It helps organize sourced trial and research information for discussion with Scott’s treating neurologist, ALS clinic, or trial coordinators.”

DO NOT
- Do not imply eligibility.
- Do not recommend treatment.
- Do not use breakthrough language unless quoting a source and labeling it.
- Do not create automatic outreach/send flows.
- Do not make a public-facing marketing site.
- Do not require login/auth implementation unless building a functional prototype; placeholder auth is fine.
- Do not deploy.
- Do not mutate production data.

DESIRED DELIVERABLE
Create a high-fidelity clickable interface prototype or code prototype for the ALS Watch private portal.

If building code, use the simplest practical stack:
- static HTML/CSS/JS is acceptable
- React/Next is acceptable if your environment expects it
- mock data is fine
- no backend required for first pass

Prototype should include:
- landing/home dashboard
- trial detail view
- Scott profile/checklist view
- lead submission form
- doctor questions view
- outreach queue concept

Use representative mock trial cards based on these examples:
- HEALEY ALS Platform Trial — Recruiting, Phase 2/3, many US sites, possible high-priority doctor question
- COYA 302 / ALSTARS — Recruiting, Phase 2, includes San Francisco location, fit gates include age/onset/ALSFRS-R/SVC
- PHENOGENE-1A / Cromolyn — Recruiting, Phase 2, includes SF/Sutter and UCSD, fit gates need review
- Dazucorilant — Recruiting, Phase 2, includes SF listing, medication/genetic caveats may matter
- INS1202 — Phase 1, Palo Alto/La Jolla, genetic/sporadic cohort fit and ALSFRS-R/disease-duration gates matter

For each sample card, show:
- fit status
- criteria highlights
- missing info
- path to consideration
- source link placeholder

OUTPUT EXPECTATIONS
Return:
1. A short summary of the design concept.
2. The prototype files or design artifact.
3. How to run/view it locally.
4. What decisions remain before making it real.

STOP CONDITIONS
Stop and ask before:
- adding real patient data
- deploying anywhere public
- adding external messaging/email/SMS
- changing auth/security assumptions
- sending outreach
```
