# Claude Design Prototype

Drop the Claude-generated ALS Watch interface prototype files here.

Purpose:
- preserve the design direction McDee liked
- review interaction patterns
- extract the best pieces into the real portal
- avoid overwriting the working `portal/` prototype until reviewed

Recommended import shape:
- `index.html`
- `styles.css`
- `app.js`
- any assets in `assets/`
- screenshots if available

Review checklist:
- progressive disclosure, not noisy dashboard
- plain-language medical translation
- trial fit / criteria / path-to-consideration visible
- Scott/Rachel view stays calm
- operator/doctor details are available but tucked away
- no real patient data
- no external sending/outreach

## Imported Claude Prototype

Imported from `ALS-Watch-Protype.zip` on 2026-05-08.

Files live in `prototypes/claude-design/import/`:
- `ALS Watch.html`
- `app.jsx`
- `data.jsx`
- `screens.jsx`
- `ui.jsx`
- `styles.css`

Run locally:

```bash
cd /Users/mcdee/Projects/als-watch
python3 -m http.server 8788 --directory prototypes/claude-design/import
```

Open:
`http://127.0.0.1:8788/ALS%20Watch.html`

Initial review:
- Strong fit for the ALS Watch direction.
- Uses role-based views for Scott, Rachel, and Operator.
- Implements progressive disclosure directly in trial cards: summary, fit snapshot, criteria, source/evidence.
- Includes plain-language translations for fit gates and eligibility criteria.
- Doctor packet / Ask the Doctor section is present.
- Good warm-paper / quiet clinical visual direction.
- Should be promoted into the canonical portal after code cleanup and local dependency removal/packaging decision.

