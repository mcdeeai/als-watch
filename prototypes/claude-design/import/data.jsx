/* global React */
// Data layer — trials, leads, doctor questions, profile, outreach, research

const TRIALS = [
  {
    id: "NCT04297683",
    name: "HEALEY ALS Platform Trial",
    phase: "Phase 2/3",
    status: "Recruiting",
    fit: "unclear",
    fitLabel: "Unclear fit — needs Scott info",
    summary:
      "A multi-arm platform trial run by Mass General that tests several ALS drug candidates at once. People are matched into a current arm based on what's open and what fits.",
    nextStep:
      "Ask the UCSF neurologist whether HEALEY is realistic for Scott right now and whether they can refer or share his records.",
    review: "Doctor",
    locations: "~70 US sites incl. UCSF Neurology",
    sponsor: "Mass General Hospital (MGH) Neurological Clinical Research Institute",
    updated: "2025-04-22",
    url: "https://clinicaltrials.gov/study/NCT04297683",
    fitGates: [
      {
        medical: "ALSFRS-R ≥ 30 (regimen-dependent)",
        plain: "Scott's daily-function score should be in the higher range. We don't have a recent score on file.",
        scott: "missing",
      },
      {
        medical: "SVC ≥ 50% predicted",
        plain: "Breathing capacity needs to be reasonably preserved. We need a recent SVC or FVC reading.",
        scott: "missing",
      },
      {
        medical: "Symptom onset ≤ 36 months (regimen-dependent)",
        plain: "Symptoms should have started within the last ~3 years. Scott's onset is within this window based on what Rachel shared.",
        scott: "likely-met",
      },
      {
        medical: "Stable riluzole/edaravone for ≥ 30 days",
        plain: "Current ALS meds shouldn't have changed in the last month before joining.",
        scott: "likely-met",
      },
    ],
    inclusion: [
      { medical: "Definite or probable ALS by El Escorial criteria", plain: "Confirmed ALS diagnosis using a standard set of clinical signs." },
      { medical: "Adequate organ function per labs", plain: "Routine blood/liver/kidney tests should be in normal ranges." },
    ],
    exclusion: [
      { medical: "Tracheostomy or invasive ventilation", plain: "Not eligible if Scott is on a breathing tube or full ventilator." },
      { medical: "Active infection or recent hospitalization", plain: "Recent serious illness can disqualify someone temporarily." },
    ],
    contact: "HEALEY ALS Coordinator — healeyplatform@mgh.harvard.edu",
    rawExcerpt:
      "Inclusion: Diagnosis of familial or sporadic ALS, El Escorial probable or definite. Onset of weakness within (regimen-specific) months. SVC ≥ 50%. Stable dose of riluzole and/or edaravone for ≥ 30 days. Exclusion: invasive ventilation, recent hospitalization for ALS-related cause within 90 days...",
    scoreReasons: [
      "Active platform with multiple open regimens",
      "UCSF is a participating site",
      "Several gates depend on data we don't have on file",
    ],
    agentNote:
      "Surfaced because Scott's onset window appears to fit and a UCSF site is active. Score withheld pending ALSFRS-R and SVC.",
  },
  {
    id: "NCT05822908",
    name: "COYA 302 (ALSTARS)",
    phase: "Phase 2",
    status: "Recruiting",
    fit: "possible",
    fitLabel: "Possible fit — review with doctor",
    summary:
      "A combination immune-cell + low-dose CTLA4-Ig therapy aimed at slowing ALS progression by calming inflammation. San Francisco is on the site list.",
    nextStep:
      "Confirm Scott's ALSFRS-R and SVC with the clinic, then let McDee draft a coordinator outreach email.",
    review: "Rachel + doctor",
    locations: "San Francisco, CA · Houston, TX · Phoenix, AZ",
    sponsor: "Coya Therapeutics",
    updated: "2025-03-30",
    url: "https://clinicaltrials.gov/study/NCT05822908",
    fitGates: [
      {
        medical: "Age 18–80",
        plain: "Scott is in this range.",
        scott: "met",
      },
      {
        medical: "Symptom onset ≤ 36 months",
        plain: "Symptoms should have started within roughly 3 years. Scott's onset appears to fit.",
        scott: "likely-met",
      },
      {
        medical: "ALSFRS-R ≥ 30",
        plain: "Daily-function score in the higher range. We need a recent number.",
        scott: "missing",
      },
      {
        medical: "SVC ≥ 60% predicted",
        plain: "Breathing capacity at least 60% of predicted normal. We need a recent reading.",
        scott: "missing",
      },
    ],
    inclusion: [
      { medical: "Definite/probable ALS, sporadic or familial", plain: "Confirmed diagnosis." },
      { medical: "On stable riluzole and/or edaravone ≥ 30 days, or none", plain: "Either no ALS meds, or doses unchanged for the last month." },
    ],
    exclusion: [
      { medical: "Active autoimmune condition requiring immunosuppression", plain: "Not eligible if Scott is being treated for another autoimmune disease." },
      { medical: "Tracheostomy or NIV > 22h/day", plain: "Not eligible if breathing assistance is needed most of the day." },
    ],
    contact: "Coordinator at SF site — listed on clinicaltrials.gov",
    rawExcerpt:
      "Inclusion: Aged 18–80. Diagnosis of familial or sporadic ALS by revised El Escorial. Symptom onset within 36 months of screening. ALSFRS-R total ≥ 30. SVC ≥ 60% predicted. Exclusion: active autoimmune disease requiring systemic immunosuppression; tracheostomy; NIV use > 22 hours/day...",
    scoreReasons: [
      "Local SF site reduces travel burden",
      "Onset window appears to fit",
      "Two key gates blocked on missing data",
    ],
    agentNote: "Promoted because of SF location and a plausible onset-window fit. Held back from outreach pending ALSFRS-R/SVC.",
  },
  {
    id: "NCT06120920",
    name: "PHENOGENE-1A · Cromolyn",
    phase: "Phase 2",
    status: "Recruiting",
    fit: "needs-info",
    fitLabel: "Needs Scott info",
    summary:
      "Tests a known mast-cell stabilizer (cromolyn) repurposed for ALS. Includes Sutter SF and UC San Diego on the site list.",
    nextStep:
      "Confirm whether the mild/moderate functional cutoffs and breathing-test requirement match Scott's most recent labs.",
    review: "Doctor",
    locations: "Sutter Health (SF) · UC San Diego",
    sponsor: "Investigator-initiated, UCSD",
    updated: "2025-02-11",
    url: "https://clinicaltrials.gov/study/NCT06120920",
    fitGates: [
      {
        medical: "Mild–moderate functional impairment",
        plain: "Scott shouldn't be too early or too late in functional decline. We need ALSFRS-R to know.",
        scott: "missing",
      },
      {
        medical: "FVC ≥ 50%",
        plain: "Forced breathing capacity at least half of predicted normal. We need a recent FVC.",
        scott: "missing",
      },
      {
        medical: "Stable ALS medication ≥ 30 days",
        plain: "Current meds shouldn't have changed in the past month.",
        scott: "likely-met",
      },
    ],
    inclusion: [
      { medical: "Diagnosis of probable or definite ALS", plain: "Confirmed ALS." },
      { medical: "Disease duration 6–36 months from symptom onset", plain: "Symptoms started between 6 months and 3 years ago." },
    ],
    exclusion: [
      { medical: "Known cromolyn allergy", plain: "Not eligible if Scott has had a reaction to cromolyn before." },
      { medical: "Severe respiratory compromise", plain: "Not eligible if breathing is severely affected already." },
    ],
    contact: "UCSD ALS Center coordinator",
    rawExcerpt:
      "Inclusion: probable/definite ALS, 6–36 months from symptom onset, FVC ≥ 50%, ALSFRS-R total in mild-to-moderate range, stable ALS medication ≥ 30 days. Exclusion: cromolyn hypersensitivity; severe respiratory compromise; current participation in another interventional trial.",
    scoreReasons: [
      "Two SF/SoCal sites reduce friction",
      "Repurposed drug — well-characterized safety profile",
      "Three gates depend on missing labs",
    ],
    agentNote: "Surfaced for repurposed-drug profile and Bay-Area site. Held until ALSFRS-R / FVC are filled in.",
  },
  {
    id: "NCT05407324",
    name: "Dazucorilant (CORT113176)",
    phase: "Phase 2",
    status: "Recruiting",
    fit: "review",
    fitLabel: "Possible fit — caveats",
    summary:
      "A selective glucocorticoid receptor modulator being tested as a potential ALS-progression-slowing therapy. San Francisco appears on the site list.",
    nextStep:
      "Have the doctor review medication overlap and any genetic caveats before McDee contacts the coordinator.",
    review: "Doctor",
    locations: "San Francisco listing · multi-site US/EU",
    sponsor: "Corcept Therapeutics",
    updated: "2025-04-08",
    url: "https://clinicaltrials.gov/study/NCT05407324",
    fitGates: [
      {
        medical: "Symptom onset ≤ 24 months",
        plain: "Symptoms should have started within the last ~2 years. Scott may be just inside this — needs confirmation.",
        scott: "needs-confirm",
      },
      {
        medical: "On stable riluzole, no edaravone overlap restrictions per protocol",
        plain: "Some current ALS meds may need to be paused or coordinated. Doctor should review.",
        scott: "doctor-question",
      },
    ],
    inclusion: [
      { medical: "Diagnosis of probable or definite ALS", plain: "Confirmed ALS." },
      { medical: "ALSFRS-R total within trial-defined range", plain: "Daily-function score in a defined band — see protocol." },
    ],
    exclusion: [
      { medical: "Use of strong CYP3A inhibitors/inducers", plain: "Some other medications interact with this drug and disqualify a person." },
      { medical: "Pregnancy/lactation", plain: "Not applicable here." },
    ],
    contact: "Corcept clinical operations",
    rawExcerpt:
      "Inclusion: Adults with diagnosis of ALS, symptom onset within 24 months. ALSFRS-R within defined range. Exclusion: concurrent use of strong CYP3A inhibitors or inducers; tracheostomy; pregnant or lactating women.",
    scoreReasons: [
      "Mechanism is novel for ALS",
      "Tighter onset window — borderline for Scott",
      "Drug-drug interactions warrant doctor review",
    ],
    agentNote: "Held from coordinator outreach until medication review by treating neurologist.",
  },
  {
    id: "NCT05819177",
    name: "INS1202",
    phase: "Phase 1",
    status: "Recruiting",
    fit: "needs-info",
    fitLabel: "Needs genetic + status check",
    summary:
      "An early-phase study with cohorts split by genetic status (sporadic vs. specific mutation carriers). Sites in Palo Alto and La Jolla.",
    nextStep:
      "Confirm whether Scott has had genetic testing — and if not, decide with the doctor whether to pursue it.",
    review: "Doctor",
    locations: "Palo Alto, CA · La Jolla, CA",
    sponsor: "Insilico Medicine",
    updated: "2025-01-19",
    url: "https://clinicaltrials.gov/study/NCT05819177",
    fitGates: [
      {
        medical: "Sporadic ALS or known SOD1/C9orf72/FUS mutation cohort",
        plain: "Scott would either need to be in the sporadic cohort or carry one of a few specific gene changes. We don't know his genetic status.",
        scott: "missing",
      },
      {
        medical: "ALSFRS-R within range",
        plain: "Daily-function score in a trial-defined range. We need the latest number.",
        scott: "missing",
      },
      {
        medical: "Disease duration window",
        plain: "Symptoms started within a defined window. We can confirm once onset date is on file.",
        scott: "needs-confirm",
      },
    ],
    inclusion: [
      { medical: "Adults 18–75", plain: "Scott is in this range." },
      { medical: "ALS diagnosis with documented onset", plain: "Confirmed diagnosis with a known symptom-onset date." },
    ],
    exclusion: [
      { medical: "Significant cardiac/hepatic comorbidity", plain: "Other significant heart or liver problems can disqualify." },
    ],
    contact: "Insilico clinical contact via NCT page",
    rawExcerpt:
      "Inclusion: adults 18–75 with ALS, ALSFRS-R within protocol-defined range, disease duration consistent with cohort assignment, sporadic ALS or documented SOD1/C9orf72/FUS variant. Exclusion: significant cardiac or hepatic comorbidity; pregnancy; concurrent investigational therapy...",
    scoreReasons: [
      "California-only sites are friendly to Scott's travel limit",
      "Genetic status is the gating question",
      "Phase 1 — earlier risk profile, doctor should weigh in",
    ],
    agentNote: "Lower-priority surface until genetic-testing question is answered.",
  },
];

const SCOTT_PROFILE = [
  { key: "location", label: "Location & travel willingness", value: "Bay Area · willing to travel within California", state: "known" },
  { key: "diag", label: "Diagnosis date", value: "Jan 2024 (UCSF Neurology)", state: "known" },
  { key: "onset", label: "Symptom onset date", value: "Approx. mid-2023 — Rachel to confirm month", state: "known", hint: "Confirming the month tightens trial onset-window matching." },
  { key: "site", label: "Site of onset", value: "Limb-onset (right arm)", state: "known" },
  { key: "genetic", label: "Genetic testing / mutation", value: "Not done — UCSF can order", state: "ask", hint: "Affects fit for INS1202 and several other gene-targeted trials." },
  { key: "alsfrs", label: "ALSFRS-R (most recent)", value: "Not on file", state: "missing", hint: "Most trials use this to gate eligibility. Ask the clinic to share the latest score." },
  { key: "fvc", label: "FVC / SVC (breathing)", value: "Not on file", state: "missing", hint: "Required by HEALEY, COYA 302, PHENOGENE-1A and others." },
  { key: "meds", label: "Current ALS medications", value: "Riluzole · started Feb 2024 (stable)", state: "known" },
  { key: "trials", label: "Prior / current trial participation", value: "None", state: "known" },
  { key: "mobility", label: "Mobility / speech / swallow / breathing notes", value: "Optional — Scott can share what's helpful", state: "optional" },
  { key: "clinic", label: "Treating ALS clinic / neurologist", value: "UCSF ALS Center · Dr. M. Chen", state: "known" },
];

const QUESTIONS = [
  {
    id: 1,
    text: "Is the HEALEY ALS Platform Trial something we should be considering for Scott right now? Could you share his most recent ALSFRS-R and SVC so we can check fit?",
    trial: "HEALEY ALS Platform Trial",
    trialId: "NCT04297683",
    why: "We need ALSFRS-R and SVC to know whether this is worth a coordinator conversation.",
  },
  {
    id: 2,
    text: "COYA 302 has a San Francisco site and Scott's onset window appears to fit. Would you be open to looking at the protocol and telling us if it's reasonable to ask?",
    trial: "COYA 302 / ALSTARS",
    trialId: "NCT05822908",
    why: "Local site, plausible onset fit, two gates blocked on missing labs.",
  },
  {
    id: 3,
    text: "Has Scott had genetic testing? Several trials (including INS1202) have genetic cohorts that change what's available to him.",
    trial: "INS1202 + general",
    trialId: "NCT05819177",
    why: "Genetic status is the single most leveraged piece of missing information right now.",
  },
  {
    id: 4,
    text: "Dazucorilant has a San Francisco listing but is sensitive to certain other medications. Could you review Scott's current med list against CYP3A inhibitors before we contact the coordinator?",
    trial: "Dazucorilant",
    trialId: "NCT05407324",
    why: "Drug-drug interaction screen is a doctor-only question.",
  },
  {
    id: 5,
    text: "Are there ALS expanded-access programs you'd recommend we keep an eye on for Scott — even if they're not formal trials?",
    trial: "General",
    trialId: null,
    why: "Operator is tracking expanded-access and compassionate-use signals; doctor input shapes which to flag.",
  },
];

const LEADS_INBOX = [
  {
    id: "L-104",
    title: "Article on stem-cell ALS work at Cedars-Sinai",
    submittedBy: "Rachel's brother (Tom)",
    when: "yesterday",
    note: "Saw this and thought of Scott — not sure if it's a real trial or just a research write-up.",
    status: "submitted",
    verified: false,
  },
  {
    id: "L-103",
    title: "Friend's neighbor mentioned a Stanford ALS clinic intake",
    submittedBy: "Rachel",
    when: "2 days ago",
    note: "Sounded like a clinic referral, not a trial. Still wanted to log it.",
    status: "triaged",
    verified: false,
  },
  {
    id: "L-102",
    title: "Twitter thread about an AI-discovered ALS candidate",
    submittedBy: "Family friend",
    when: "last week",
    note: "Looks early. Maybe research watch?",
    status: "moved-to-research",
    verified: false,
  },
];

const OUTREACH = [
  { id: "O-009", subject: "COYA 302 — eligibility questions for a Bay-Area patient", to: "SF site coordinator", status: "needs approval", trial: "NCT05822908" },
  { id: "O-008", subject: "PHENOGENE-1A — confirming current open slots at Sutter", to: "Sutter ALS coordinator", status: "draft", trial: "NCT06120920" },
  { id: "O-007", subject: "HEALEY platform — referral pathway for UCSF patient", to: "MGH HEALEY coordinator", status: "approved", trial: "NCT04297683" },
  { id: "O-006", subject: "Genetic testing pathway question", to: "UCSF Neurology — Dr. Chen", status: "sent", trial: null },
  { id: "O-005", subject: "Re: information about trial timelines", to: "Family friend (lead L-098)", status: "reply received", trial: null },
  { id: "O-004", subject: "Cromolyn ALS arm — site logistics", to: "UCSD ALS Center", status: "closed", trial: "NCT06120920" },
];

const RESEARCH = [
  {
    kind: "Research paper",
    title: "Plasma neurofilament light as an ALS progression biomarker — updated cohort",
    body: "Larger cohort confirms earlier signal that pNfL trends correlate with progression rate. Not actionable for trial enrollment, but worth raising at the next clinic visit.",
    source: "Neurology · April 2026",
    actionable: false,
  },
  {
    kind: "AI / drug discovery",
    title: "Insilico publishes Phase 1 readout for AI-discovered ALS candidate",
    body: "Tolerability profile reported as expected for Phase 1. No new sites are open beyond what's already in Trials & Leads.",
    source: "Sponsor press release",
    actionable: false,
  },
  {
    kind: "Expanded access",
    title: "Possible expanded-access pathway opening for a SOD1-targeted therapy",
    body: "Signals only — sponsor has not confirmed. Worth flagging if Scott's genetic testing comes back as SOD1.",
    source: "ALS foundation update · cross-referenced",
    actionable: true,
  },
  {
    kind: "Foundation update",
    title: "ALS Association adds two new platform-trial regimens",
    body: "Two additional candidate compounds joining the HEALEY platform later this year. Will surface as separate cards once protocols are public.",
    source: "ALS Association",
    actionable: false,
  },
];

window.ALSData = { TRIALS, SCOTT_PROFILE, QUESTIONS, LEADS_INBOX, OUTREACH, RESEARCH };
