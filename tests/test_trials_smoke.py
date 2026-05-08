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
