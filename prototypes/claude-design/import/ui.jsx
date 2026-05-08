/* global React */
const { useState } = React;

// =============================================================
// Pills / status helpers
// =============================================================

function Pill({ tone = "neutral", dot, children }) {
  const cls = tone === "neutral" ? "pill" : `pill ${tone}`;
  return (
    <span className={cls}>
      {dot && <span className="dot"></span>}
      {children}
    </span>
  );
}

function FitPill({ fit, label }) {
  const map = {
    "possible":     { tone: "trust", text: label || "Possible fit" },
    "unclear":      { tone: "amber", text: label || "Unclear fit" },
    "needs-info":   { tone: "amber", text: label || "Needs Scott info" },
    "review":       { tone: "amber", text: label || "Review needed" },
    "not-fit":      { tone: "red",   text: label || "Not a fit" },
  };
  const m = map[fit] || { tone: "neutral", text: label || fit };
  return <Pill tone={m.tone} dot>{m.text}</Pill>;
}

function GateState({ state }) {
  const map = {
    "met":            { tone: "trust", text: "Likely met" },
    "likely-met":     { tone: "trust", text: "Likely met" },
    "missing":        { tone: "amber", text: "Missing data" },
    "needs-confirm":  { tone: "amber", text: "Needs confirmation" },
    "doctor-question":{ tone: "amber", text: "Doctor question" },
    "blocker":        { tone: "red",   text: "Blocker" },
  };
  const m = map[state] || { tone: "neutral", text: state };
  return <Pill tone={m.tone}>{m.text}</Pill>;
}

// =============================================================
// Disclosure band
// =============================================================

function Disclosure({ eyebrow, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={"disclosure-band" + (open ? " open" : "")}>
      <button className="disclosure-head" onClick={() => setOpen(o => !o)}>
        <div>
          <div className="disclosure-eyebrow">{eyebrow}</div>
          <div className="disclosure-title">{title}</div>
        </div>
        <span className="disclosure-chevron">›</span>
      </button>
      {open && <div className="disclosure-body fade-in">{children}</div>}
    </div>
  );
}

// =============================================================
// Trial card with progressive disclosure
// =============================================================

function TrialCard({ t, defaultExpanded = false }) {
  const [open, setOpen] = useState(defaultExpanded);
  return (
    <div className={"trial-card" + (open ? " expanded" : "")}>
      <div className="trial-head">
        <div>
          <div className="trial-meta">
            <FitPill fit={t.fit} label={t.fitLabel} />
            <Pill tone="ghost">{t.phase}</Pill>
            <Pill tone="ghost">{t.status}</Pill>
            <span className="trial-id">{t.id}</span>
          </div>
          <h3 className="trial-title">{t.name}</h3>
          <p className="trial-plain">{t.summary}</p>
          <div className="trial-next">
            <span className="trial-next-label">Next step</span>
            <span className="trial-next-text">{t.nextStep}</span>
          </div>
        </div>
        <div className="trial-aside">
          <span className="small">Review with</span>
          <Pill tone="trust">{t.review}</Pill>
          <span className="small mono">{t.locations.split("·")[0].trim()}</span>
        </div>
      </div>

      <div className="trial-actions">
        <button className="btn primary" onClick={() => setOpen(o => !o)}>
          {open ? "Hide details" : "Show fit, criteria & source"}
        </button>
        <button className="btn">Add doctor question</button>
        <a className="btn ghost" href={t.url} target="_blank" rel="noreferrer">Open on ClinicalTrials.gov ↗</a>
      </div>

      {open && (
        <div className="disclosure fade-in">
          <Disclosure eyebrow="Layer 2" title="Fit snapshot — why this came up, and what's missing" defaultOpen>
            <p style={{ marginTop: 4, color: "var(--ink-2)", maxWidth: "62ch" }}>
              {t.agentNote}
            </p>
            <div style={{ marginTop: 14 }}>
              {t.fitGates.map((g, i) => (
                <div key={i} className="crit">
                  <div className="crit-medical">{g.medical}</div>
                  <div className="crit-plain">{g.plain}</div>
                  <div style={{ marginTop: 6 }}><GateState state={g.scott} /></div>
                </div>
              ))}
            </div>
          </Disclosure>

          <Disclosure eyebrow="Layer 3" title="Criteria details — inclusion, exclusion, sites, contact">
            <div className="stack gap-4" style={{ marginTop: 8 }}>
              <div>
                <div className="mini-eyebrow">Key inclusion criteria</div>
                {t.inclusion.map((c, i) => (
                  <div key={i} className="crit">
                    <div className="crit-medical">{c.medical}</div>
                    <div className="crit-plain">{c.plain}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="mini-eyebrow">Key exclusion criteria</div>
                {t.exclusion.map((c, i) => (
                  <div key={i} className="crit exclude">
                    <div className="crit-medical">{c.medical}</div>
                    <div className="crit-plain">{c.plain}</div>
                  </div>
                ))}
              </div>
              <dl className="kv">
                <dt>Locations</dt><dd>{t.locations}</dd>
                <dt>Sponsor</dt><dd>{t.sponsor}</dd>
                <dt>Coordinator</dt><dd>{t.contact}</dd>
              </dl>
            </div>
          </Disclosure>

          <Disclosure eyebrow="Layer 4" title="Source & evidence — for operator / doctor review">
            <div className="stack gap-4" style={{ marginTop: 8 }}>
              <dl className="kv">
                <dt>Source</dt><dd><a href={t.url} target="_blank" rel="noreferrer">{t.url}</a></dd>
                <dt>Last updated</dt><dd>{t.updated}</dd>
                <dt>Sponsor metadata</dt><dd>{t.sponsor}</dd>
              </dl>
              <div>
                <div className="mini-eyebrow">Raw eligibility excerpt</div>
                <div className="source-block">{t.rawExcerpt}</div>
              </div>
              <div>
                <div className="mini-eyebrow">Why the agent surfaced this</div>
                <ul style={{ margin: "6px 0 0 18px", color: "var(--ink-2)" }}>
                  {t.scoreReasons.map((r, i) => <li key={i} style={{ marginBottom: 4 }}>{r}</li>)}
                </ul>
              </div>
              <div>
                <div className="mini-eyebrow">Agent note (audit trail)</div>
                <div className="source-block">{t.agentNote}</div>
              </div>
            </div>
          </Disclosure>
        </div>
      )}
    </div>
  );
}

window.ALSUI = { Pill, FitPill, GateState, Disclosure, TrialCard };
