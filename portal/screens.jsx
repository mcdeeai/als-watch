/* global React, ALSData, ALSUI */
const { useState } = React;
const { Pill, FitPill, GateState, TrialCard } = window.ALSUI;
const { TRIALS, SCOTT_PROFILE, QUESTIONS, LEADS_INBOX, OUTREACH, RESEARCH } = window.ALSData;

// =============================================================
// Today
// =============================================================

function ScreenToday() {
  const top = TRIALS[1]; // COYA 302 — primary "ask about" today
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
          <button className="btn primary">Open trial card</button>
          <button className="btn">Add to "Ask the doctor" list</button>
        </div>
      </div>

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

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 28 }}>
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

window.ALSScreens = { ScreenToday, ScreenTrials, ScreenProfile, ScreenDoctor, ScreenInbox, ScreenOutreach, ScreenResearch };
