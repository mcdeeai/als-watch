"""ClinicalTrials.gov watcher for ALS Watch v0.

This module intentionally uses only the Python standard library so it can run
on a fresh machine. It fetches ALS-related studies, normalizes the fields we
care about, scores actionability transparently, persists seen/update state, and
writes a Markdown digest for human review.
"""
from __future__ import annotations

import argparse
import dataclasses
import datetime as dt
import json
import os
import re
import sys
import textwrap
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Iterable

API_URL = "https://clinicaltrials.gov/api/v2/studies"
TRIAL_URL = "https://clinicaltrials.gov/study/{nct_id}"
DEFAULT_STATE = Path("state/clinicaltrials_seen.json")
ACTIVE_STATUSES = {
    "RECRUITING",
    "NOT_YET_RECRUITING",
    "ACTIVE_NOT_RECRUITING",
    "ENROLLING_BY_INVITATION",
    "AVAILABLE",
}
HIGH_VALUE_TERMS = (
    "expanded access",
    "compassionate",
    "treatment",
    "therapy",
    "drug",
    "intervention",
    "phase 2",
    "phase ii",
    "phase 3",
    "phase iii",
    "tofersen",
    "sod1",
    "c9orf72",
    "stem cell",
    "antisense",
    "gene therapy",
)
C9ORF72_TERMS = (
    "c9orf72",
    "c9orf72 repeat",
    "c9orf72 expansion",
    "hexanucleotide repeat",
    "ggggcc",
    "g4c2",
    "dipeptide repeat",
    "dpr",
    "poly-gp",
    "poly-ga",
    "poly-gr",
    "antisense oligonucleotide",
    "aso",
)


@dataclasses.dataclass
class TrialLead:
    nct_id: str
    title: str
    official_title: str
    status: str
    phase: str
    study_type: str
    interventions: list[str]
    sponsor: str
    collaborators: list[str]
    conditions: list[str]
    eligibility: str
    locations: list[str]
    contacts: list[str]
    last_update: str
    brief_summary: str
    expanded_access: str
    source_url: str
    score: int
    score_reasons: list[str]

    @property
    def fingerprint(self) -> str:
        return f"{self.last_update}|{self.status}|{self.phase}|{','.join(self.locations[:10])}"


def deep_get(obj: dict[str, Any], path: Iterable[str], default: Any = None) -> Any:
    cur: Any = obj
    for part in path:
        if not isinstance(cur, dict) or part not in cur:
            return default
        cur = cur[part]
    return cur


def as_list(value: Any) -> list[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def clean_text(value: Any, max_len: int | None = None) -> str:
    if value is None:
        return ""
    text = re.sub(r"\s+", " ", str(value)).strip()
    if max_len and len(text) > max_len:
        return text[: max_len - 1].rstrip() + "…"
    return text


def parse_date(value: str) -> dt.date | None:
    if not value:
        return None
    try:
        if len(value) == 7:  # YYYY-MM
            return dt.date.fromisoformat(value + "-01")
        if len(value) == 4:  # YYYY
            return dt.date(int(value), 1, 1)
        return dt.date.fromisoformat(value[:10])
    except Exception:
        return None


def fetch_studies(condition: str, page_size: int = 100, max_pages: int = 10) -> list[dict[str, Any]]:
    studies: list[dict[str, Any]] = []
    page_token = None
    for _ in range(max_pages):
        params = {
            "query.cond": condition,
            "pageSize": str(page_size),
            "format": "json",
        }
        if page_token:
            params["pageToken"] = page_token
        url = API_URL + "?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={"User-Agent": "ALS-Watch/0.1"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.load(resp)
        studies.extend(data.get("studies", []))
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return studies


def normalize_study(study: dict[str, Any]) -> TrialLead:
    proto = study.get("protocolSection", {})
    ident = proto.get("identificationModule", {})
    status_mod = proto.get("statusModule", {})
    design = proto.get("designModule", {})
    arms = proto.get("armsInterventionsModule", {})
    sponsor_mod = proto.get("sponsorCollaboratorsModule", {})
    cond_mod = proto.get("conditionsModule", {})
    elig_mod = proto.get("eligibilityModule", {})
    contacts_mod = proto.get("contactsLocationsModule", {})
    desc_mod = proto.get("descriptionModule", {})

    nct_id = ident.get("nctId", "UNKNOWN")
    phases = [p.replace("NA", "N/A") for p in as_list(design.get("phases"))]
    interventions = []
    for item in as_list(arms.get("interventions")):
        name = item.get("name") if isinstance(item, dict) else None
        if name:
            interventions.append(clean_text(name, 120))

    locations = []
    for loc in as_list(contacts_mod.get("locations")):
        if not isinstance(loc, dict):
            continue
        parts = [loc.get("facility"), loc.get("city"), loc.get("state"), loc.get("country")]
        joined = clean_text(", ".join([p for p in parts if p]))
        if joined:
            locations.append(joined)

    contacts = []
    for contact in as_list(contacts_mod.get("centralContacts")):
        if not isinstance(contact, dict):
            continue
        pieces = [contact.get("name"), contact.get("phone"), contact.get("email")]
        text = clean_text(" | ".join([p for p in pieces if p]))
        if text:
            contacts.append(text)

    expanded_info = status_mod.get("expandedAccessInfo") or {}
    expanded_access = "yes" if expanded_info.get("hasExpandedAccess") else "no"

    lead = TrialLead(
        nct_id=nct_id,
        title=clean_text(ident.get("briefTitle") or ident.get("officialTitle") or nct_id, 180),
        official_title=clean_text(ident.get("officialTitle") or "", 220),
        status=clean_text(status_mod.get("overallStatus") or "UNKNOWN"),
        phase=", ".join(phases) if phases else "Not provided",
        study_type=clean_text(design.get("studyType") or "Not provided"),
        interventions=interventions,
        sponsor=clean_text(deep_get(sponsor_mod, ["leadSponsor", "name"], ""), 120),
        collaborators=[clean_text(c.get("name"), 120) for c in as_list(sponsor_mod.get("collaborators")) if isinstance(c, dict) and c.get("name")],
        conditions=[clean_text(c, 120) for c in as_list(cond_mod.get("conditions"))],
        eligibility=clean_text(elig_mod.get("eligibilityCriteria") or "", 900),
        locations=locations,
        contacts=contacts,
        last_update=clean_text(deep_get(status_mod, ["lastUpdatePostDateStruct", "date"], status_mod.get("lastUpdateSubmitDate") or "")),
        brief_summary=clean_text(desc_mod.get("briefSummary") or "", 700),
        expanded_access=expanded_access,
        source_url=TRIAL_URL.format(nct_id=nct_id),
        score=0,
        score_reasons=[],
    )
    lead.score, lead.score_reasons = score_lead(lead)
    return lead


def score_lead(lead: TrialLead) -> tuple[int, list[str]]:
    score = 0
    reasons: list[str] = []
    status = lead.status.upper()
    phase = lead.phase.upper()
    text_blob = " ".join([
        lead.title,
        lead.official_title,
        lead.brief_summary,
        lead.eligibility,
        " ".join(lead.interventions),
    ]).lower()

    if status == "RECRUITING":
        score += 35; reasons.append("recruiting now")
    elif status == "NOT_YET_RECRUITING":
        score += 25; reasons.append("not yet recruiting; worth watching early")
    elif status == "ENROLLING_BY_INVITATION":
        score += 20; reasons.append("enrolling by invitation")
    elif status == "ACTIVE_NOT_RECRUITING":
        score += 8; reasons.append("active but not currently recruiting")

    if "PHASE3" in phase or "PHASE 3" in phase or "PHASE III" in phase:
        score += 18; reasons.append("later-stage Phase 3 signal")
    elif "PHASE2" in phase or "PHASE 2" in phase or "PHASE II" in phase:
        score += 15; reasons.append("Phase 2 signal")
    elif "PHASE1" in phase or "PHASE 1" in phase or "PHASE I" in phase:
        score += 7; reasons.append("early-stage Phase 1 signal")

    if lead.study_type.upper() == "INTERVENTIONAL":
        score += 15; reasons.append("interventional study")
    elif lead.study_type.upper() == "OBSERVATIONAL":
        score += 5; reasons.append("observational study")

    if any("United States" in loc for loc in lead.locations):
        score += 10; reasons.append("has US location(s)")
    if lead.contacts:
        score += 7; reasons.append("public contact listed")
    if lead.expanded_access == "yes" or "expanded access" in text_blob:
        score += 12; reasons.append("expanded-access signal")
    if any(term in text_blob for term in C9ORF72_TERMS):
        score += 14; reasons.append("C9orf72/genetic-subtype signal; verify mutation and criteria with doctor")
    if any(term in text_blob for term in HIGH_VALUE_TERMS):
        score += 8; reasons.append("treatment/therapy/genetic relevance terms")

    updated = parse_date(lead.last_update)
    if updated and (dt.date.today() - updated).days <= 30:
        score += 8; reasons.append("updated in last 30 days")
    elif updated and (dt.date.today() - updated).days <= 90:
        score += 4; reasons.append("updated in last 90 days")

    return min(score, 100), reasons or ["low-confidence; needs human review"]


def load_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"seen": {}}
    try:
        return json.loads(path.read_text())
    except Exception:
        return {"seen": {}}


def save_state(path: Path, state: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(state, indent=2, sort_keys=True) + "\n")
    tmp.replace(path)


def filter_recent_or_changed(leads: list[TrialLead], state: dict[str, Any], days: int, include_seen: bool) -> list[TrialLead]:
    cutoff = dt.date.today() - dt.timedelta(days=days)
    seen = state.setdefault("seen", {})
    out: list[TrialLead] = []
    for lead in leads:
        updated = parse_date(lead.last_update)
        recent = bool(updated and updated >= cutoff)
        prior = seen.get(lead.nct_id)
        changed = prior != lead.fingerprint
        active = lead.status.upper() in ACTIVE_STATUSES
        if include_seen:
            out.append(lead)
        elif prior is None and active:
            out.append(lead)
        elif active and changed and recent:
            out.append(lead)
    return sorted(out, key=lambda l: (l.score, l.last_update), reverse=True)


def update_seen(state: dict[str, Any], leads: list[TrialLead]) -> None:
    seen = state.setdefault("seen", {})
    for lead in leads:
        seen[lead.nct_id] = lead.fingerprint
    state["last_run_at"] = dt.datetime.now(dt.timezone.utc).isoformat()


def bullet_list(items: list[str], empty: str = "Not provided", limit: int = 8) -> str:
    if not items:
        return empty
    shown = items[:limit]
    suffix = f" (+{len(items) - limit} more)" if len(items) > limit else ""
    return "; ".join(shown) + suffix


def render_lead(lead: TrialLead) -> str:
    why = "; ".join(lead.score_reasons[:5])
    text_blob = " ".join([
        lead.title,
        lead.official_title,
        lead.brief_summary,
        lead.eligibility,
        " ".join(lead.interventions),
    ]).lower()
    if any(term in text_blob for term in C9ORF72_TERMS):
        question = "Ask whether Scott's C9orf72 genetic result and current clinical status match this study's genotype-specific criteria, and what records/tests would be needed before contacting the coordinator."
    else:
        question = "Ask whether this study is clinically realistic for Scott and what eligibility data would be needed before contacting the coordinator."
    return textwrap.dedent(f"""
    ### {lead.title} ({lead.nct_id})
    - **Status / phase:** {lead.status} / {lead.phase}
    - **Actionability score:** {lead.score}/100 — {why}
    - **Study type:** {lead.study_type}
    - **Interventions:** {bullet_list(lead.interventions)}
    - **Sponsor:** {lead.sponsor or 'Not provided'}
    - **Locations:** {bullet_list(lead.locations, 'No locations listed yet', 6)}
    - **Contacts:** {bullet_list(lead.contacts, 'No public central contact listed', 3)}
    - **Eligibility clues:** {lead.eligibility or 'Not provided in fetched record'}
    - **Why it may matter:** {lead.brief_summary or 'No summary provided'}
    - **Suggested doctor/coordinator question:** {question}
    - **Source:** {lead.source_url}
    """).strip()


def render_digest(leads: list[TrialLead], days: int, condition: str) -> str:
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    top = [l for l in leads if l.score >= 55]
    watch = [l for l in leads if 30 <= l.score < 55]
    low = [l for l in leads if l.score < 30]

    parts = [
        f"# ALS Watch Clinical Trial Digest — {now}",
        "",
        f"Query: ClinicalTrials.gov condition `{condition}`; showing active/recent/new-or-changed records from roughly the last {days} day(s), plus unseen active leads.",
        "",
        "**Safety note:** ALS Watch does not provide medical advice. Use this as sourced opportunity intelligence for discussion with Scott’s treating neurologist, ALS clinic, or trial coordinators.",
        "",
        f"Found {len(leads)} new/updated/watchable lead(s).",
        "",
        "## Top actionable leads",
        "",
        "\n\n".join(render_lead(l) for l in top[:10]) if top else "No high-actionability leads in this run.",
        "",
        "## Other new/updated trials worth watching",
        "",
        "\n\n".join(render_lead(l) for l in watch[:15]) if watch else "No mid-priority watch items in this run.",
        "",
        "## Low-confidence / no-action items",
        "",
        "\n\n".join(render_lead(l) for l in low[:10]) if low else "No low-confidence items in this run.",
        "",
        "## Raw source links",
        "",
        "\n".join(f"- {l.nct_id}: {l.source_url}" for l in leads) if leads else "- None",
        "",
    ]
    return "\n".join(parts)


def run(args: argparse.Namespace) -> int:
    state_path = Path(args.state)
    out_path = Path(args.out)
    state = load_state(state_path)
    studies = fetch_studies(args.condition, page_size=args.page_size, max_pages=args.max_pages)
    leads = [normalize_study(study) for study in studies]
    selected = filter_recent_or_changed(leads, state, args.days, args.include_seen)
    digest = render_digest(selected, args.days, args.condition)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(digest + "\n")
    if not args.dry_run:
        update_seen(state, leads)
        save_state(state_path, state)
    print(f"Fetched {len(studies)} studies; wrote {len(selected)} lead(s) to {out_path}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="ALS Watch ClinicalTrials.gov watcher")
    parser.add_argument("--condition", default="Amyotrophic Lateral Sclerosis")
    parser.add_argument("--days", type=int, default=7)
    parser.add_argument("--out", default="out/digest.md")
    parser.add_argument("--state", default=str(DEFAULT_STATE))
    parser.add_argument("--page-size", type=int, default=100)
    parser.add_argument("--max-pages", type=int, default=10)
    parser.add_argument("--include-seen", action="store_true", help="include all fetched active leads even if already seen")
    parser.add_argument("--dry-run", action="store_true", help="do not update seen state")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return run(args)
    except KeyboardInterrupt:
        return 130
    except Exception as exc:
        print(f"ALS Watch trial watcher failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
