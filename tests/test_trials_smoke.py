import argparse
import json

from als_watch import packet
from als_watch.trials import filter_recent_or_changed, normalize_study, render_digest


def fixture(status="RECRUITING"):
    return {
        "protocolSection": {
            "identificationModule": {
                "nctId": "NCT00000001",
                "briefTitle": "A Test ALS Treatment Study",
                "officialTitle": "A Test ALS Treatment Study Official",
            },
            "statusModule": {
                "overallStatus": status,
                "expandedAccessInfo": {"hasExpandedAccess": False},
                "lastUpdatePostDateStruct": {"date": "2099-01-01"},
            },
            "sponsorCollaboratorsModule": {"leadSponsor": {"name": "Test Sponsor"}},
            "descriptionModule": {"briefSummary": "A treatment trial for ALS."},
            "conditionsModule": {"conditions": ["Amyotrophic Lateral Sclerosis"]},
            "designModule": {"studyType": "INTERVENTIONAL", "phases": ["PHASE2"]},
            "armsInterventionsModule": {"interventions": [{"name": "Test drug"}]},
            "eligibilityModule": {"eligibilityCriteria": "Inclusion Criteria: ALS diagnosis."},
            "contactsLocationsModule": {
                "centralContacts": [{"name": "Coordinator", "email": "trial@example.org"}],
                "locations": [{"facility": "Test ALS Center", "city": "San Francisco", "state": "California", "country": "United States"}],
            },
        }
    }


def test_normalize_scores_recruiting_interventional_trial():
    lead = normalize_study(fixture())
    assert lead.nct_id == "NCT00000001"
    assert lead.score >= 70
    assert "recruiting now" in lead.score_reasons
    assert "https://clinicaltrials.gov/study/NCT00000001" == lead.source_url


def test_digest_contains_safety_note_and_source():
    lead = normalize_study(fixture())
    digest = render_digest([lead], 7, "Amyotrophic Lateral Sclerosis")
    assert "does not provide medical advice" in digest
    assert "NCT00000001" in digest
    assert lead.source_url in digest


def test_filter_respects_seen_changes():
    lead = normalize_study(fixture())
    state = {"seen": {lead.nct_id: lead.fingerprint}}
    assert filter_recent_or_changed([lead], state, 7, include_seen=False) == []
    assert filter_recent_or_changed([lead], state, 7, include_seen=True) == [lead]


def test_packet_portal_trial_contains_review_fields():
    lead = normalize_study(fixture())
    trial = packet.lead_to_portal_trial(lead)
    assert trial["id"] == "NCT00000001"
    assert trial["fitStatus"]
    assert trial["pathToConsideration"]
    assert trial["missingScottInfo"]
    assert trial["sourceUrl"] == lead.source_url


def test_packet_run_writes_all_outputs_without_network(tmp_path, monkeypatch):
    monkeypatch.setattr(packet, "fetch_studies", lambda *args, **kwargs: [fixture()])
    out_dir = tmp_path / "out"
    args = argparse.Namespace(
        condition="Amyotrophic Lateral Sclerosis",
        days=30,
        out_dir=str(out_dir),
        state=str(tmp_path / "state.json"),
        page_size=100,
        max_pages=1,
        include_seen=True,
        dry_run=True,
    )

    assert packet.run(args) == 0

    assert (out_dir / "digest.md").exists()
    assert (out_dir / "daily-packet.md").exists()
    assert (out_dir / "portal-data.json").exists()
    assert (out_dir / "discord-message.md").exists()

    portal_data = json.loads((out_dir / "portal-data.json").read_text())
    assert portal_data["topActions"]
    assert portal_data["trials"][0]["nctId"] == "NCT00000001"
    discord = (out_dir / "discord-message.md").read_text()
    assert "ALS Watch Daily Packet" in discord
    assert "Status:" in discord
    assert "Doctor questions" in discord
    assert "out/daily-packet.md" in discord
    assert "out/portal-data.json" in discord
    assert "urgent" not in discord.lower()
    assert len(discord) <= 1500


def test_packet_core_als_filter_excludes_broad_sidebar_condition():
    lead = normalize_study(fixture())
    lead.conditions = ["Adjustment Disorder"]
    lead.title = "RE104 Safety and Efficacy Study in Adjustment Disorder in Cancer and Other Medical Illnesses"
    lead.official_title = lead.title
    lead.brief_summary = "Includes illnesses such as Amyotrophic Lateral Sclerosis (ALS), Multiple Sclerosis, and Parkinson's Disease."
    assert packet.is_core_als_lead(lead) is False

    lead.conditions = ["Amyotrophic Lateral Sclerosis"]
    assert packet.is_core_als_lead(lead) is True
