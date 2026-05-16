"""Daily packet generation for ALS Watch.

This module turns normalized ClinicalTrials.gov leads into three local,
inspectable outputs:

- the existing full digest Markdown
- a concise daily packet Markdown
- portal-consumable JSON
- a portal daily-update record
- an operator-ready Markdown/text snippet

It intentionally does not send messages, contact anyone, deploy, or read/write
real patient data.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import textwrap
from pathlib import Path
from typing import Any

from als_watch.trials import (
    C9ORF72_TERMS,
    DEFAULT_STATE,
    TrialLead,
    bullet_list,
    fetch_studies,
    filter_recent_or_changed,
    load_state,
    normalize_study,
    render_digest,
    save_state,
    update_seen,
)

SAFETY_NOTE = (
    "ALS Watch does not provide medical advice, determine eligibility, or send outreach. "
    "Use this as sourced opportunity intelligence for discussion with Scott's treating "
    "neurologist, ALS clinic, or approved care-network members."
)

CORE_MISSING_INFO = [
    "Need symptom onset date",
    "Need diagnosis date and diagnosis details",
    "Need latest ALSFRS-R score",
    "Need latest FVC/SVC or respiratory status",
    "Need current ALS medication list",
    "Need prior/current trial participation history",
    "Need travel feasibility and preferred ALS clinic/site",
]

C9ORF72_MISSING_INFO = [
    "Need exact genetic-test wording for C9orf72, including whether a pathogenic repeat expansion was confirmed",
    "Need whether the report mentions repeat-expansion size/range or lab interpretation",
    "Need whether FTD/cognitive or behavioral symptoms are present, if Scott wants that tracked",
    "Need whether any C9orf72-specific trial or genetic counseling referral has already been discussed",
]

DISCORD_TARGET_CHARS = 1500


def _unique(items: list[str], limit: int | None = None) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for item in items:
        key = item.strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(item.strip())
        if limit and len(out) >= limit:
            break
    return out


def _shorten(text: str, max_len: int) -> str:
    clean = re.sub(r"\s+", " ", text).strip()
    if len(clean) <= max_len:
        return clean
    return clean[: max_len - 1].rstrip() + "…"


def _eligibility_sections(criteria: str) -> tuple[list[str], list[str]]:
    text = criteria.strip()
    if not text:
        return [], []

    inc_match = re.search(
        r"inclusion criteria:?(.*?)(?:exclusion criteria:?|$)",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    exc_match = re.search(
        r"exclusion criteria:?(.*)$",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )

    def split_lines(section: str) -> list[str]:
        rough = re.split(r"(?:\s*[-*]\s+)|(?:\s*\d+[.)]\s+)|(?:;\s+)", section)
        return _unique([clean for item in rough if (clean := item.strip(" .;\n\t"))], 6)

    inclusion = split_lines(inc_match.group(1)) if inc_match else []
    exclusion = split_lines(exc_match.group(1)) if exc_match else []
    if not inclusion and not exclusion:
        inclusion = _unique([text], 1)
    return inclusion, exclusion


def infer_missing_info(lead: TrialLead) -> list[str]:
    """Infer Scott-specific facts needed before assessing fit."""
    blob = " ".join(
        [
            lead.title,
            lead.official_title,
            lead.brief_summary,
            lead.eligibility,
            " ".join(lead.interventions),
        ]
    ).lower()
    missing = list(CORE_MISSING_INFO)

    if any(term in blob for term in ["sod1", "c9orf72", "fus", "tardbp", "mutation", "genetic"]):
        missing.append("Need genetic testing result, including SOD1/C9orf72/FUS/TARDBP if available")
    if any(term in blob for term in C9ORF72_TERMS):
        missing.extend(C9ORF72_MISSING_INFO)
    if any(term in blob for term in ["feeding tube", "gastrostomy", "peg"]):
        missing.append("Need feeding tube / swallowing status")
    if any(term in blob for term in ["ventilation", "tracheostomy", "niv", "non-invasive ventilation"]):
        missing.append("Need ventilation use details")
    if any(term in blob for term in ["riluzole", "edaravone", "tofersen"]):
        missing.append("Need stability/timing of riluzole, edaravone, tofersen, or other ALS therapies")
    if any(term in blob for term in ["onset", "diagnosis within", "months"]):
        missing.append("Need exact months since symptom onset and diagnosis")

    return _unique(missing, 10)


def fit_status_for(lead: TrialLead) -> str:
    if lead.score >= 75:
        return "Possible fit / needs missing info"
    if lead.score >= 55:
        return "Unclear fit / ask doctor if high-value"
    if lead.score >= 30:
        return "Watch item / not enough information"
    return "Low-confidence watch item"


def path_to_consideration(lead: TrialLead) -> str:
    if lead.contacts:
        return "Ask treating neurologist whether to pursue; if doctor agrees, use the listed public trial contact to ask about pre-screening requirements."
    if lead.locations:
        return "Ask treating neurologist or ALS clinic whether referral/pre-screening is realistic at the listed site(s)."
    return "Ask treating neurologist whether this lead is clinically relevant, then monitor the source page for site/contact updates."


def lead_to_portal_trial(lead: TrialLead) -> dict[str, Any]:
    inclusion, exclusion = _eligibility_sections(lead.eligibility)
    locations = lead.locations[:8]
    missing = infer_missing_info(lead)
    key_gates = _unique(
        [
            "Diagnosis/onset timing",
            "Respiratory status (FVC/SVC or ventilation use)",
            "ALSFRS-R / functional status",
            "Genetic status if trial-specific",
            "Current ALS meds and prior trial exposure",
            "Travel/site access",
        ],
        8,
    )
    return {
        "id": lead.nct_id,
        "nctId": lead.nct_id,
        "title": lead.title,
        "status": lead.status,
        "phase": lead.phase,
        "fitStatus": fit_status_for(lead),
        "reviewStatus": "needs human/doctor review",
        "plainSummary": lead.brief_summary or "No plain-language summary was available in the fetched record.",
        "nextStep": path_to_consideration(lead),
        "locations": locations,
        "contact": bullet_list(lead.contacts, "No public central contact listed", 3),
        "pathToConsideration": path_to_consideration(lead),
        "keyFitGates": key_gates,
        "inclusionPlain": inclusion or ["Eligibility details were not provided in the fetched record."],
        "exclusionPlain": exclusion or ["Exclusion details were not provided in the fetched record."],
        "missingScottInfo": missing,
        "sourceUrl": lead.source_url,
        "score": lead.score,
        "scoreReasons": lead.score_reasons,
        "coreAlsLead": is_core_als_lead(lead),
    }


def build_doctor_questions(leads: list[TrialLead]) -> list[str]:
    questions: list[str] = []
    for lead in leads[:5]:
        blob = " ".join(
            [
                lead.title,
                lead.official_title,
                lead.brief_summary,
                lead.eligibility,
                " ".join(lead.interventions),
            ]
        ).lower()
        if any(term in blob for term in C9ORF72_TERMS):
            questions.append(
                f"{lead.nct_id}: This appears to have a C9orf72/genetic-subtype signal. Does Scott's genetic report match the trial's required mutation/repeat-expansion criteria, and what records or tests would a coordinator need for pre-screening?"
            )
            continue
        questions.append(
            f"{lead.nct_id}: Could this possible lead be clinically realistic for Scott based on diagnosis/onset timing, respiratory status, genetics, current meds, and prior trial exposure? If yes, what records or tests are needed before contacting the coordinator?"
        )
    if not questions:
        questions.append("No new high-priority trial-specific doctor questions were generated in this run.")
    return questions


def build_top_actions(leads: list[TrialLead]) -> list[str]:
    if not leads:
        return [
            "Review the full digest for source coverage.",
            "Update Scott-specific missing info before the next fit review.",
            "Keep watcher state intact and rerun on the next cadence.",
        ]

    top = leads[:3]
    actions = [
        f"Ask doctor to review {lead.nct_id}: {lead.title} ({lead.score}/100)."
        for lead in top
    ]
    actions.append("Fill missing Scott info blocking fit assessment: onset/diagnosis dates, ALSFRS-R, FVC/SVC, exact C9orf72/genetic report wording, meds, prior trials, and travel feasibility.")
    return actions[:3]


def is_core_als_lead(lead: TrialLead) -> bool:
    """Return true when ALS is the direct trial condition/focus, not only a keyword/sidebar disease."""
    condition_text = " ".join(lead.conditions).lower()
    title_text = f"{lead.title} {lead.official_title}".lower()
    summary_text = lead.brief_summary.lower()
    direct_condition = any(
        term in condition_text
        for term in ["amyotrophic lateral sclerosis", "als", "motor neuron disease"]
    )
    direct_title = any(
        term in title_text
        for term in ["amyotrophic lateral sclerosis", "als", "motor neuron disease"]
    )
    if direct_condition or direct_title:
        return True
    # If ALS only appears in a broad list of other illnesses, keep it out of top-action notifications.
    broad_non_als = any(term in condition_text for term in ["adjustment disorder", "cancer", "multiple sclerosis", "parkinson"])
    if broad_non_als:
        return False
    return "amyotrophic lateral sclerosis" in summary_text or " als" in summary_text


def build_packet(leads: list[TrialLead], days: int, condition: str) -> dict[str, Any]:
    generated_at = dt.datetime.now(dt.timezone.utc).isoformat()
    sorted_leads = sorted(leads, key=lambda lead: (lead.score, lead.last_update), reverse=True)
    core_leads = [lead for lead in sorted_leads if is_core_als_lead(lead)]
    high_priority = [lead for lead in core_leads if lead.score >= 55]
    missing = _unique([item for lead in high_priority[:5] for item in infer_missing_info(lead)], 12)
    if not missing:
        missing = CORE_MISSING_INFO[:6]

    sources = [
        {"id": lead.nct_id, "title": lead.title, "url": lead.source_url}
        for lead in sorted_leads
    ]
    return {
        "generatedAt": generated_at,
        "condition": condition,
        "days": days,
        "status": {
            "selectedLeadCount": len(sorted_leads),
            "coreAlsLeadCount": len(core_leads),
            "worthReviewCount": len(high_priority),
            "message": (
                f"Reviewed {len(sorted_leads)} selected ClinicalTrials.gov record(s); "
                f"{len(high_priority)} ALS-focused lead(s) look worth review. No outreach sent."
            ),
        },
        "safetyNote": SAFETY_NOTE,
        "topActions": build_top_actions(high_priority or core_leads or sorted_leads),
        "trials": [lead_to_portal_trial(lead) for lead in sorted_leads],
        "missingInfo": missing,
        "doctorQuestions": build_doctor_questions(high_priority),
        "sources": sources,
    }


def render_daily_packet(packet: dict[str, Any]) -> str:
    generated = packet["generatedAt"]
    trials = packet["trials"]
    high = [trial for trial in trials if trial["score"] >= 55 and trial.get("coreAlsLead", True)]
    shown = high[:5]
    shown_sources = packet["sources"][:25]
    source_note = ""
    if len(packet["sources"]) > len(shown_sources):
        source_note = f"\n\nShowing top {len(shown_sources)} source link(s); full source list is in `out/portal-data.json`."

    lead_blocks = []
    for trial in shown:
        lead_blocks.append(
            textwrap.dedent(
                f"""
                ### {trial['title']} ({trial['nctId']})
                - **Status / phase:** {trial['status']} / {trial['phase']}
                - **Review status:** {trial['fitStatus']}
                - **Score:** {trial['score']}/100 — {'; '.join(trial['scoreReasons'][:4])}
                - **Plain summary:** {trial['plainSummary']}
                - **Next step:** {trial['nextStep']}
                - **Locations:** {bullet_list(trial['locations'], 'No locations listed yet', 5)}
                - **Missing Scott info:** {bullet_list(trial['missingScottInfo'], 'None inferred', 6)}
                - **Source:** {trial['sourceUrl']}
                """
            ).strip()
        )

    parts = [
        f"# ALS Watch Daily Packet — {generated}",
        "",
        "## Today's read",
        "",
        f"- **Status:** {packet['status']['message']}",
        f"- **Window:** roughly the last {packet['days']} day(s) for `{packet['condition']}`.",
        "- **Local outputs:** `out/digest.md`, `out/daily-packet.md`, `out/portal-data.json`, `out/operator-message.md`.",
        f"- **Safety note:** {packet['safetyNote']}",
        "",
        "## Top moves",
        "",
        "\n".join(f"{idx}. {item}" for idx, item in enumerate(packet["topActions"], start=1)),
        "",
        "## Lead details",
        "",
        "\n\n".join(lead_blocks) if lead_blocks else "No ALS-focused leads reached the worth-review threshold in this run.",
        "",
        "## Missing Scott info blocking fit assessment",
        "",
        "\n".join(f"- {item}" for item in packet["missingInfo"]),
        "",
        "## Doctor questions generated from leads",
        "",
        "\n".join(f"- {item}" for item in packet["doctorQuestions"]),
        "",
        "## Links to full source/trial pages",
        "",
        (
            "\n".join(f"- {source['id']}: {source['url']}" for source in shown_sources) + source_note
            if shown_sources
            else "- None"
        ),
        "",
    ]
    return "\n".join(parts)



def build_portal_update(packet: dict[str, Any]) -> dict[str, Any]:
    worth_review = [
        trial
        for trial in packet["trials"]
        if trial.get("score", 0) >= 55 and trial.get("coreAlsLead", True)
    ]
    return {
        "id": packet["generatedAt"],
        "generatedAt": packet["generatedAt"],
        "title": "ALS Watch Daily Update",
        "status": packet["status"],
        "summary": packet["status"]["message"],
        "topActions": packet["topActions"][:3],
        "worthReview": [
            {
                "nctId": trial["nctId"],
                "title": trial["title"],
                "score": trial["score"],
                "fitStatus": trial["fitStatus"],
                "nextStep": trial["nextStep"],
                "sourceUrl": trial["sourceUrl"],
            }
            for trial in worth_review[:5]
        ],
        "missingInfo": packet["missingInfo"][:8],
        "doctorQuestions": packet["doctorQuestions"][:5],
        "files": {
            "fullPacket": "out/daily-packet.md",
            "portalData": "out/portal-data.json",
            "operatorMessage": "out/operator-message.md",
        },
        "safetyNote": packet["safetyNote"],
    }


def render_portal_update_markdown(update: dict[str, Any]) -> str:
    leads = update["worthReview"]
    lead_lines = [
        f"- {lead['nctId']} ({lead['score']}/100): {lead['title']} — {lead['fitStatus']}"
        for lead in leads[:3]
    ] or ["- No ALS-focused leads crossed the worth-review threshold today."]
    return "\n".join([
        f"# {update['title']} — {update['generatedAt']}",
        "",
        f"**Today’s read:** {update['summary']}",
        "",
        "## Top moves",
        "",
        "\n".join(f"{idx}. {item}" for idx, item in enumerate(update['topActions'], start=1)),
        "",
        "## Leads worth review",
        "",
        "\n".join(lead_lines),
        "",
        "## Missing Scott info",
        "",
        "\n".join(f"- {item}" for item in update['missingInfo'][:6]),
        "",
        "## Doctor questions",
        "",
        "\n".join(f"- {item}" for item in update['doctorQuestions'][:3]),
        "",
        f"Safety: {update['safetyNote']}",
        "",
    ])


def render_operator_message(packet: dict[str, Any]) -> str:
    worth_review = [
        trial
        for trial in packet["trials"]
        if trial.get("score", 0) >= 55 and trial.get("coreAlsLead", True)
    ]
    top_moves = [_shorten(action, 150) for action in packet["topActions"][:3]]
    missing = [_shorten(item, 76) for item in (packet["missingInfo"][:4] or ["No missing info inferred."])]
    doctor_questions = [
        f"For {trial['nctId']}, ask: clinically realistic given onset timing, respiratory status, genetics, meds, and prior trial exposure?"
        for trial in worth_review[:2]
    ]
    if not doctor_questions:
        doctor_questions = ["No lead-specific doctor questions today; keep the missing-info list current."]

    lead_line = "No ALS-focused leads crossed the worth-review threshold today."
    if worth_review:
        lead_line = "Worth review: " + "; ".join(
            f"{trial['nctId']} ({trial['score']}/100)"
            for trial in worth_review[:3]
        )

    parts = [
        "## ALS Watch Daily Packet",
        "",
        f"**Status:** {packet['status']['message']} {lead_line}",
        "",
        "**Top 3 moves**",
        "\n".join(f"{idx}. {item}" for idx, item in enumerate(top_moves, start=1)),
        "",
        "**Missing Scott info**",
        "\n".join(f"- {item}" for item in missing),
        "",
        "**Doctor questions**",
        "\n".join(f"- {item}" for item in doctor_questions),
        "",
        "**Files**",
        "- Full packet: `out/daily-packet.md`",
        "- Portal JSON: `out/portal-data.json`",
        "",
        f"Safety: {packet['safetyNote']}",
        "",
    ]
    message = "\n".join(parts)
    if len(message) <= DISCORD_TARGET_CHARS:
        return message

    compact_parts = [
        "## ALS Watch Daily Packet",
        "",
        f"**Status:** {_shorten(packet['status']['message'], 150)} {lead_line}",
        "",
        "**Top 3 moves**",
        "\n".join(f"{idx}. {_shorten(item, 115)}" for idx, item in enumerate(packet["topActions"][:3], start=1)),
        "",
        "**Missing Scott info**",
        "\n".join(f"- {_shorten(item, 62)}" for item in packet["missingInfo"][:3]),
        "",
        "**Doctor questions**",
        f"- {_shorten(doctor_questions[0], 150)}",
        "",
        "**Files**",
        "- Full packet: `out/daily-packet.md`",
        "- Portal JSON: `out/portal-data.json`",
        "",
        "Safety: Not medical advice; ask doctor before any outreach or next step.",
        "",
    ]
    return "\n".join(compact_parts)


def write_outputs(packet: dict[str, Any], digest: str, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    portal_update = build_portal_update(packet)
    (out_dir / "digest.md").write_text(digest + "\n")
    (out_dir / "daily-packet.md").write_text(render_daily_packet(packet) + "\n")
    (out_dir / "portal-data.json").write_text(json.dumps(packet, indent=2, sort_keys=True) + "\n")
    (out_dir / "portal-update.json").write_text(json.dumps(portal_update, indent=2, sort_keys=True) + "\n")
    (out_dir / "portal-update.md").write_text(render_portal_update_markdown(portal_update) + "\n")
    (out_dir / "operator-message.md").write_text(render_operator_message(packet) + "\n")


def run(args: argparse.Namespace) -> int:
    out_dir = Path(args.out_dir)
    state_path = Path(args.state)
    state = load_state(state_path)
    studies = fetch_studies(args.condition, page_size=args.page_size, max_pages=args.max_pages)
    leads = [normalize_study(study) for study in studies]
    selected = filter_recent_or_changed(leads, state, args.days, args.include_seen)
    digest = render_digest(selected, args.days, args.condition)
    packet = build_packet(selected, args.days, args.condition)
    write_outputs(packet, digest, out_dir)

    if not args.dry_run:
        update_seen(state, leads)
        save_state(state_path, state)

    print(
        f"Fetched {len(studies)} studies; wrote {len(selected)} lead(s) to "
        f"{out_dir / 'digest.md'}, {out_dir / 'daily-packet.md'}, "
        f"{out_dir / 'portal-data.json'}, {out_dir / 'portal-update.json'}, {out_dir / 'portal-update.md'}, and {out_dir / 'operator-message.md'}"
    )
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="ALS Watch daily packet generator")
    parser.add_argument("--condition", default="Amyotrophic Lateral Sclerosis")
    parser.add_argument("--days", type=int, default=1)
    parser.add_argument("--out-dir", default="out")
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
        print(f"ALS Watch packet generation failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
