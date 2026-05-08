/* global React, ALSData, ALSUI */
const { useState } = React;
const { Pill, FitPill, GateState, TrialCard } = window.ALSUI;
const { TRIALS, SCOTT_PROFILE, QUESTIONS, LEADS_INBOX, OUTREACH, RESEARCH } = window.ALSData;


// =============================================================
// Intro / Mission
// =============================================================

function ScreenIntro() {
  return (
    <div data-screen-label="Mission">
      <div className="page-head">
        <div className="page-eyebrow">Mission</div>
        <h1 className="page-title">An ALS opportunity desk for Scott and Rachel.</h1>
        <p className="page-sub">
          ALS Watch uses AI to monitor the latest information, filter noise, translate what matters,
          and help mobilize the right next action when something could be relevant.
        </p>
      </div>

      <div className="today-hero mission-hero">
        <div className="today-eyebrow">North star</div>
        <h2 className="today-headline">Give Scott and Rachel the best possible chance to act on legitimate options in time.</h2>
        <p className="today-because">
          This is not an AI doctor and it does not determine eligibility. It is a watch desk: scan the
          field, identify possible opportunities, explain them plainly, prepare better questions, and
          help the real care team and trusted network move faster when something is worth reviewing.
        </p>
        <div className="row gap-3" style={{ flexWrap: "wrap" }}>
          <Pill tone="trust">Watch broadly</Pill>
          <Pill tone="amber">Ask doctors</Pill>
          <Pill tone="ghost">Mobilize network</Pill>
        </div>
      </div>

      <div className="mission-grid">
        <div className="card">
          <div className="mini-eyebrow">1 · Watch broadly</div>
          <h3 className="mini-title">Monitor the places opportunities appear.</h3>
          <p className="mini-text">
            ClinicalTrials.gov, ALS clinics, foundations, expanded-access signals, biotech updates,
            PubMed/preprints, researcher announcements, and credible advocacy networks.
          </p>
        </div>
        <div className="card">
          <div className="mini-eyebrow">2 · Decide what matters</div>
          <h3 className="mini-title">Separate real possibilities from noise.</h3>
          <p className="mini-text">
            Is it actually ALS-relevant? Is it actionable now? Is it local, remote, referral-based,
            watch-only, or not a fit? What Scott-specific info is missing?
          </p>
        </div>
        <div className="card">
          <div className="mini-eyebrow">3 · Translate into action</div>
          <h3 className="mini-title">Turn medical language into plain next steps.</h3>
          <p className="mini-text">
            Explain fit gates, missing information, possible blockers, doctor questions, contact paths,
            and why a lead may or may not be worth reviewing.
          </p>
        </div>
        <div className="card">
          <div className="mini-eyebrow">4 · Mobilize resources</div>
          <h3 className="mini-title">Use the network when a lead becomes actionable.</h3>
          <p className="mini-text">
            Who can help? Is there a UCSF, Stanford, MGH, Barrow, foundation, biotech, donor, board,
            or coordinator connection? Should Rachel ask the doctor, McDee call someone, or a packet be prepared?
          </p>
        </div>
      </div>



      <div className="section-head" style={{ marginTop: 28 }}>
        <h2>Where this is in development</h2>
        <span className="meta">Early review prototype</span>
      </div>
      <div className="phase-grid">
        <div className="phase-card active">
          <div className="mini-eyebrow">Now · first useful iteration</div>
          <h3 className="mini-title">Start the watch process.</h3>
          <p className="mini-text">
            The system scans trial data, produces a daily update, translates some medical language,
            and shows the kind of questions worth bringing to doctors. It is intentionally simple.
          </p>
        </div>
        <div className="phase-card">
          <div className="mini-eyebrow">Next</div>
          <h3 className="mini-title">Improve signal quality and fit review.</h3>
          <p className="mini-text">
            Separate new leads from old watchlist items, reduce noisy matches, improve plain-language
            explanations, and connect leads to Scott-specific missing information.
          </p>
        </div>
        <div className="phase-card">
          <div className="mini-eyebrow">Then</div>
          <h3 className="mini-title">Prepare doctor and coordinator packets.</h3>
          <p className="mini-text">
            Turn promising leads into clean packets for the care team: criteria, source links, missing
            facts, and specific questions — still with no automatic outreach.
          </p>
        </div>
        <div className="phase-card">
          <div className="mini-eyebrow">Later</div>
          <h3 className="mini-title">Mobilize the network when something is actionable.</h3>
          <p className="mini-text">
            If a lead becomes real, identify who can help: doctors, clinics, researchers, foundations,
            trial coordinators, warm intros, and trusted friends who can move something forward.
          </p>
        </div>
      </div>

      <div className="h-rule"></div>

      <div className="section-head">
        <h2>The operating loop</h2>
        <span className="meta">What the system is trying to do every day</span>
      </div>
      <div className="loop-strip">
        <span>scan</span>
        <span>filter</span>
        <span>translate</span>
        <span>assess fit</span>
        <span>find missing info</span>
        <span>prepare doctor questions</span>
        <span>track next steps</span>
      </div>

      <div className="card mission-promise">
        <div className="mini-eyebrow">Promise</div>
        <p>
          If there is a legitimate ALS opportunity somewhere in the system, ALS Watch should help
          Scott and Rachel know about it, understand it, and take the right next step with their doctors
          and trusted network.
        </p>
      </div>

      <p className="disclaimer">
        ALS Watch does not provide medical advice, recommend treatment, or determine trial eligibility.
        It organizes sourced information for discussion with Scott’s neurologist, ALS clinic, trial
        coordinators, and trusted care-network reviewers.
      </p>
    </div>
  );
}

// =============================================================
// Today
// =============================================================

function ScreenToday() {
  const top = TRIALS[1]; // COYA 302 — primary "ask about" today
  const [showTrial, setShowTrial] = useState(false);
  return (
    <div data-screen-label="Today">
      <div className="page-head">
        <div className="page-eyebrow">Friday · May 8</div>
        <h1 className="page-title">Quiet today. One thing worth asking about.</h1>
        <p className="page-sub">No emergencies. The agent has surfaced a single conversation to bring to UCSF, plus two smaller things that can wait.</p>
      </div>

      <div className="today-hero">
        <div className="today-eyebrow">Top thing to ask about</div>
        <h2 className="today-headline">Bring COYA 302 up at Scott's next UCSF visit.</h2>
        <p className="today-because">
          It has a San Francisco site and Scott's symptom-onset window appears to fit. Two of its
          eligibility gates depend on his most recent ALSFRS-R and breathing test, which we don't
          have on file. Asking the clinic for those numbers is the unblocking move.
        </p>
        <div className="row gap-3" style={{ marginBottom: 18, flexWrap: "wrap" }}>
          <FitPill fit={top.fit} label={top.fitLabel} />
          <Pill tone="trust">Review with: Rachel + doctor</Pill>
          <Pill tone="ghost">{top.id}</Pill>
        </div>
        <div className="row gap-3">
          <button className="btn primary" onClick={() => setShowTrial(open => !open)}>
            {showTrial ? "Hide trial card" : "Open trial card"}
          </button>
          <button className="btn">Add to "Ask the doctor" list</button>
        </div>
      </div>

      {showTrial && (
        <div className="today-trial-example fade-in">
          <div className="section-head">
            <h2>Example expanded trial card</h2>
            <span className="meta">Shows fit, criteria, path, and source layers</span>
          </div>
          <TrialCard t={top} defaultExpanded />
        </div>
      )}

      <div className="today-secondary">
        <div className="card">
          <div className="mini-eyebrow">Also worth a look · this week</div>
          <h3 className="mini-title">PHENOGENE-1A (Cromolyn)</h3>
          <p className="mini-text">
            Local Sutter site. Held until the clinic confirms Scott's FVC and ALSFRS-R, since both
            gate eligibility.
          </p>
          <Pill tone="amber" dot>Needs Scott info</Pill>
        </div>
        <div className="card">
          <div className="mini-eyebrow">Also worth a look · this week</div>
          <h3 className="mini-title">Genetic testing pathway</h3>
          <p className="mini-text">
            Several gene-targeted trials (incl. INS1202) become possible only if Scott has genetic
            testing on file. UCSF can order this — worth deciding together.
          </p>
          <Pill tone="amber" dot>Decision with doctor</Pill>
        </div>
      </div>

      <div className="h-rule"></div>

      <div className="section-head">
        <h2>Missing information the agent is waiting on</h2>
        <span className="meta">Filling these in unlocks 3 of the 5 active trial cards</span>
      </div>
      <div className="card tight stack gap-3">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <div className="profile-field-label">Most recent ALSFRS-R score</div>
            <div className="profile-hint">Used by HEALEY, COYA 302, PHENOGENE-1A and INS1202.</div>
          </div>
          <Pill tone="amber">Ask the clinic</Pill>
        </div>
        <div className="section-rule"></div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <div className="profile-field-label">Most recent FVC or SVC reading</div>
            <div className="profile-hint">Used by every trial card currently in view.</div>
          </div>
          <Pill tone="amber">Ask the clinic</Pill>
        </div>
        <div className="section-rule"></div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <div className="profile-field-label">Genetic testing status</div>
            <div className="profile-hint">Affects fit for INS1202 and any future SOD1/C9orf72 trials.</div>
          </div>
          <Pill tone="amber">Decision with doctor</Pill>
        </div>
      </div>

      <p className="disclaimer">
        ALS Watch is a private tool to help organize information. It does not provide medical advice
        and does not determine eligibility for any trial. All decisions are made with Scott and his
        treating clinicians.
      </p>
    </div>
  );
}

// =============================================================
// Trials & Leads
// =============================================================

function ScreenTrials() {
  const [filter, setFilter] = useState("all");
  const filters = [
    { id: "all",        label: "All" },
    { id: "possible",   label: "Possible fit" },
    { id: "unclear",    label: "Unclear / needs info" },
    { id: "review",     label: "Doctor review needed" },
    { id: "watching",   label: "Watching" },
  ];
  const filtered = TRIALS.filter(t => {
    if (filter === "all") return true;
    if (filter === "possible") return t.fit === "possible";
    if (filter === "unclear") return t.fit === "unclear" || t.fit === "needs-info";
    if (filter === "review") return t.fit === "review";
    return true;
  });

  return (
    <div data-screen-label="Trials and leads">
      <div className="page-head">
        <div className="page-eyebrow">Trials & leads</div>
        <h1 className="page-title">Five trials in view. Calm cards, not a table.</h1>
        <p className="page-sub">
          Each card opens in layers: a plain answer, a fit snapshot, the criteria details, and the
          underlying source. Nothing is sent anywhere automatically.
        </p>
      </div>

      <div className="filters">
        {filters.map(f => (
          <button
            key={f.id}
            className={"filter-chip" + (filter === f.id ? " active" : "")}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="stack gap-3">
        {filtered.map((t, i) => <TrialCard key={t.id} t={t} defaultExpanded={i === 0 && filter === "all"} />)}
      </div>
    </div>
  );
}

// =============================================================
// Scott Fit Profile
// =============================================================

function ScreenProfile() {
  const groups = [
    { label: "Known", filter: r => r.state === "known" },
    { label: "Missing — would unlock multiple trials", filter: r => r.state === "missing" },
    { label: "Ask the doctor", filter: r => r.state === "ask" },
    { label: "Optional — only if Scott chooses to share", filter: r => r.state === "optional" },
  ];
  return (
    <div data-screen-label="Scott profile">
      <div className="page-head">
        <div className="page-eyebrow">Scott · fit profile</div>
        <h1 className="page-title">A gentle, partial picture — not an intake form.</h1>
        <p className="page-sub">
          Only what's helpful for evaluating trials. Scott chooses what to share. Missing fields
          don't block anything except the matching itself.
        </p>
      </div>

      {groups.map(g => {
        const rows = SCOTT_PROFILE.filter(g.filter);
        if (!rows.length) return null;
        return (
          <div key={g.label} style={{ marginBottom: 28 }}>
            <div className="section-head">
              <h2>{g.label}</h2>
              <span className="meta">{rows.length} {rows.length === 1 ? "item" : "items"}</span>
            </div>
            <div className="profile-grid">
              {rows.map(r => (
                <div key={r.key} className={"profile-row " + r.state}>
                  <div className={"profile-check " + r.state}>
                    {r.state === "ask" ? "?" : ""}
                  </div>
                  <div>
                    <div className="profile-field-label">{r.label}</div>
                    <div className="profile-value">{r.value}</div>
                    {r.hint && <div className="profile-hint">{r.hint}</div>}
                  </div>
                  <div>
                    {r.state === "missing" && <Pill tone="amber">Ask the clinic</Pill>}
                    {r.state === "ask" && <Pill tone="amber">Doctor question</Pill>}
                    {r.state === "known" && <Pill tone="trust">On file</Pill>}
                    {r.state === "optional" && <Pill tone="ghost">Optional</Pill>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <p className="disclaimer">
        These fields exist to help match trials, not to assess Scott. He can leave any of them blank.
      </p>
    </div>
  );
}

// =============================================================
// Ask the Doctor
// =============================================================

function ScreenDoctor() {
  return (
    <div data-screen-label="Ask the doctor">
      <div className="page-head">
        <div className="page-eyebrow">Ask the doctor</div>
        <h1 className="page-title">Five questions for the next UCSF visit.</h1>
        <p className="page-sub">
          Each question is linked to the lead that generated it, so the doctor can see the context
          without scrolling through anything else.
        </p>
      </div>

      <div className="row gap-3" style={{ marginBottom: 22 }}>
        <button className="btn primary">Export as printable packet</button>
        <button className="btn">Share with Rachel</button>
        <button className="btn ghost">+ Add a question</button>
      </div>

      <div>
        {QUESTIONS.map(q => (
          <div key={q.id} className="qrow">
            <div className="qnum">{String(q.id).padStart(2, "0")}</div>
            <div>
              <div className="qtext">{q.text}</div>
              <div className="qsrc">
                <strong>Why it's here:</strong> {q.why}
                {q.trial && <> · Linked to <em>{q.trial}</em>{q.trialId ? ` (${q.trialId})` : ""}</>}
              </div>
            </div>
            <button className="btn small ghost">↗</button>
          </div>
        ))}
      </div>

      <div className="h-rule"></div>

      <div className="card">
        <div className="mini-eyebrow">Doctor packet preview</div>
        <h3 className="mini-title">What gets shared</h3>
        <p className="mini-text">
          A clean, sourced PDF: the five questions, the trial cards they came from, the
          ClinicalTrials.gov links, and the bits of Scott's profile that are relevant. No agent
          chatter, no scoring, no raw model output.
        </p>
        <div className="row gap-3"><Pill tone="trust">Sourced</Pill><Pill tone="ghost">Plain language</Pill><Pill tone="ghost">PDF</Pill></div>
      </div>
    </div>
  );
}

// =============================================================
// Lead Inbox
// =============================================================

function ScreenInbox() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div data-screen-label="Lead inbox">
      <div className="page-head">
        <div className="page-eyebrow">Lead inbox</div>
        <h1 className="page-title">A quiet way for friends and family to send things in.</h1>
        <p className="page-sub">
          Anything submitted here is clearly labeled <em>submitted, not verified</em>. McDee triages
          it before it ever reaches Scott or Rachel.
        </p>
      </div>

      <div className="inbox-layout">
        <div className="card">
          <div className="mini-eyebrow">Submit a lead</div>
          <h3 className="mini-title" style={{ marginBottom: 14 }}>Send something Scott's way — gently.</h3>
          {submitted ? (
            <div className="stack gap-3">
              <Pill tone="trust">Thank you — submitted</Pill>
              <p className="mini-text" style={{ marginBottom: 0 }}>
                It will be reviewed before anyone shares it with Scott. If it turns out to be a real
                trial lead, you'll see it as a card in Trials & Leads.
              </p>
              <button className="btn ghost" style={{ alignSelf: "flex-start" }} onClick={() => setSubmitted(false)}>Submit another</button>
            </div>
          ) : (
            <form className="form-grid" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
              <div className="field">
                <label>Link, contact, article or trial page</label>
                <input className="input" placeholder="https://… or a name and phone number" />
              </div>
              <div className="field">
                <label>Why you think it might matter</label>
                <textarea className="textarea" placeholder="A sentence or two is plenty. No medical interpretation needed." />
              </div>
              <div className="field">
                <label>Your name (so we can thank you and follow up)</label>
                <input className="input" placeholder="Your name" />
              </div>
              <div className="field">
                <label>Anything else? <span className="hint">(optional)</span></label>
                <textarea className="textarea" placeholder="Optional context — how you came across it, who suggested it." />
              </div>
              <div className="row gap-3">
                <button className="btn primary" type="submit">Submit lead</button>
                <span className="muted" style={{ fontSize: 13 }}>Nothing is shared with Scott until it's been reviewed.</span>
              </div>
            </form>
          )}
        </div>

        <div>
          <div className="section-head">
            <h2>Recently submitted</h2>
            <span className="meta">{LEADS_INBOX.length} items</span>
          </div>
          {LEADS_INBOX.map(l => (
            <div key={l.id} className={"lead-card" + (!l.verified ? " unverified" : "")}>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <Pill tone="ghost">submitted, not verified</Pill>
                <span className="muted mono" style={{ fontSize: 12 }}>{l.id}</span>
              </div>
              <div className="profile-field-label" style={{ marginBottom: 4 }}>{l.title}</div>
              <div className="profile-hint" style={{ fontStyle: "normal" }}>
                From {l.submittedBy} · {l.when}
              </div>
              <p className="mini-text" style={{ margin: "8px 0 0" }}>{l.note}</p>
              <div className="row gap-3" style={{ marginTop: 10 }}>
                {l.status === "submitted" && <Pill tone="amber">awaiting triage</Pill>}
                {l.status === "triaged" && <Pill tone="trust">triaged</Pill>}
                {l.status === "moved-to-research" && <Pill tone="ghost">moved to research watch</Pill>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Outreach Queue (operator)
// =============================================================

function ScreenOutreach() {
  return (
    <div data-screen-label="Outreach queue">
      <div className="page-head">
        <div className="page-eyebrow">Outreach queue · operator</div>
        <h1 className="page-title">Drafts only. Nothing leaves this app on its own.</h1>
        <p className="page-sub">
          Every email here was drafted by the agent, reviewed by McDee, and approved (or not) by a
          human before sending. Status flows in one direction.
        </p>
      </div>

      <div className="row gap-3" style={{ marginBottom: 18 }}>
        <Pill tone="ghost">draft 1</Pill>
        <Pill tone="amber">needs approval 1</Pill>
        <Pill tone="trust">approved 1</Pill>
        <Pill tone="trust">sent 1</Pill>
        <Pill tone="trust">reply received 1</Pill>
        <Pill tone="ghost">closed 1</Pill>
      </div>

      <div>
        {OUTREACH.map(o => {
          let tone = "ghost";
          if (o.status === "needs approval") tone = "amber";
          if (o.status === "approved" || o.status === "sent" || o.status === "reply received") tone = "trust";
          return (
            <div key={o.id} className={"outreach-row" + (o.status === "draft" ? " draft" : "")}>
              <span className="mono muted" style={{ fontSize: 12 }}>{o.id}</span>
              <div>
                <div className="profile-field-label">{o.subject}</div>
                <div className="profile-hint" style={{ fontStyle: "normal" }}>
                  To: {o.to}{o.trial ? ` · ${o.trial}` : ""}
                </div>
              </div>
              <Pill tone={tone}>{o.status}</Pill>
              <button className="btn small">Open</button>
            </div>
          );
        })}
      </div>

      <div className="h-rule"></div>

      <div className="card">
        <div className="mini-eyebrow">Approval gate</div>
        <h3 className="mini-title">Before anything is sent</h3>
        <p className="mini-text">
          Drafts move from <em>needs approval</em> to <em>approved</em> only after McDee or Rachel
          has reviewed them. Sending happens in a normal email client — never from inside the agent.
        </p>
      </div>
    </div>
  );
}


// =============================================================
// Daily Updates
// =============================================================

function ScreenUpdates() {
  const fallback = {
    title: "ALS Watch Daily Update",
    generatedAt: "Prototype data",
    summary: "ALS Watch scanned the latest trial data and found a small set of ALS-focused leads worth doctor review. No outreach has been sent.",
    topActions: [
      "Ask doctor to review HEALEY ALS Platform Trial fit.",
      "Ask doctor to review Pridopidine Phase 3 fit and site availability.",
      "Confirm Scott’s latest ALSFRS-R, FVC/SVC, genetics, meds, and prior trial history.",
    ],
    worthReview: [
      { nctId: "NCT04297683", title: "HEALEY ALS Platform Trial", score: 100, fitStatus: "Possible fit / needs missing info", sourceUrl: "https://clinicaltrials.gov/study/NCT04297683" },
      { nctId: "NCT07322003", title: "Pridopidine Phase 3", score: 100, fitStatus: "Possible fit / needs missing info", sourceUrl: "#" },
      { nctId: "NCT07287397", title: "VTx-002 in ALS", score: 98, fitStatus: "Possible fit / needs missing info", sourceUrl: "#" },
    ],
    missingInfo: ["symptom onset date", "diagnosis date/details", "ALSFRS-R", "FVC/SVC", "genetic testing status", "current meds"],
    doctorQuestions: ["Are any of these realistic enough to contact coordinators?", "What records/tests are needed first?"],
  };
  const update = window.ALSPortalUpdate || fallback;
  const topMoves = update.topActions || fallback.topActions;
  const leads = update.worthReview || fallback.worthReview;
  const missing = update.missingInfo || fallback.missingInfo;
  const doctorQuestions = update.doctorQuestions || fallback.doctorQuestions;
  return (
    <div data-screen-label="Daily updates">
      <div className="page-head">
        <div className="page-eyebrow">Daily updates</div>
        <h1 className="page-title">The agent’s daily read, kept calm.</h1>
        <p className="page-sub">
          This is where watcher notifications should land inside the portal: short summary first,
          then the leads and missing information behind the next layer. Nothing is sent externally.
        </p>
      </div>


      <div className="card early-note">
        <div className="mini-eyebrow">Early-stage note</div>
        <h3 className="mini-title">This daily update is the first version of the watch process.</h3>
        <p className="mini-text">
          It is meant to start becoming useful: scan the field, surface possible ALS-specific leads,
          show missing Scott information, and suggest doctor questions. It is not yet a final fit
          assessment, medical recommendation, or outreach workflow.
        </p>
      </div>

      <div className="today-hero">
        <div className="today-eyebrow">Today’s read</div>
        <h2 className="today-headline">{update.title}</h2>
        <p className="today-because">{update.summary || update.read}</p>
        <div className="row gap-3" style={{ flexWrap: "wrap" }}>
          <Pill tone="trust">No outreach sent</Pill>
          <Pill tone="amber">Doctor review needed</Pill>
          <Pill tone="ghost">{update.generatedAt || "Source-backed"}</Pill>
        </div>
      </div>

      <div className="section-head">
        <h2>Top moves</h2>
        <span className="meta">Plain-language next steps</span>
      </div>
      <div className="card tight">
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {topMoves.map((move, i) => <li key={i} style={{ marginBottom: 10 }}>{move}</li>)}
        </ol>
      </div>

      <div className="today-secondary" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="mini-eyebrow">Leads worth review</div>
          {leads.map((lead, i) => (
            <p key={i} className="mini-text">• {lead.nctId ? `${lead.nctId}: ${lead.title} (${lead.score}/100) — ${lead.fitStatus}` : lead}</p>
          ))}
        </div>
        <div className="card">
          <div className="mini-eyebrow">Missing Scott info</div>
          {missing.map((item, i) => <Pill key={i} tone="amber" dot>{item}</Pill>)}
        </div>
      </div>


      <div className="section-head" style={{ marginTop: 24 }}>
        <h2>Doctor questions</h2>
        <span className="meta">Generated from today’s leads</span>
      </div>
      <div className="card tight">
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {doctorQuestions.slice(0, 4).map((question, i) => <li key={i} style={{ marginBottom: 10 }}>{question}</li>)}
        </ul>
      </div>

      <p className="disclaimer">
        Daily updates are not medical advice and do not determine eligibility. They organize sourced
        opportunities for discussion with Scott’s neurologist, ALS clinic, or care-network reviewers.
      </p>
    </div>
  );
}

// =============================================================
// Research Watch
// =============================================================

function ScreenResearch() {
  return (
    <div data-screen-label="Research watch">
      <div className="page-head">
        <div className="page-eyebrow">Research watch</div>
        <h1 className="page-title">Lower-pressure section. Interesting, not urgent.</h1>
        <p className="page-sub">
          A clearly-separated stream of papers, AI/drug-discovery signals, expanded-access news, and
          foundation updates. Nothing here is a trial opportunity unless explicitly labeled.
        </p>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {RESEARCH.map((r, i) => (
          <div key={i} className="research-row">
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
              <span className="src">{r.kind}</span>
              {r.actionable
                ? <Pill tone="trust" dot>Actionable signal</Pill>
                : <Pill tone="ghost">Interesting research</Pill>}
            </div>
            <h4>{r.title}</h4>
            <p>{r.body}</p>
            <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>{r.source}</div>
          </div>
        ))}
      </div>

      <p className="disclaimer">
        Items in Research Watch never move to Trials & Leads automatically. McDee promotes a signal
        to a trial card only when there's an actual protocol and contact path.
      </p>
    </div>
  );
}

window.ALSScreens = { ScreenIntro, ScreenToday, ScreenTrials, ScreenProfile, ScreenDoctor, ScreenInbox, ScreenOutreach, ScreenResearch, ScreenUpdates };
