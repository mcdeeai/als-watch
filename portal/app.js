const data = {
  topActions: [
    'Review HEALEY ALS Platform Trial eligibility with UCSF doctor; note onset timing and FVC/SVC requirements.',
    'Check whether COYA 302 / ALSTARS has realistic California access and whether Scott meets ALSFRS-R/SVC criteria.',
    'Prepare Scott/Rachel intake fields that improve matching: onset date, diagnosis date, genetic status, FVC/SVC, ALSFRS-R, meds, travel tolerance.'
  ],
  questions: [
    'Which current trials should we actively pursue vs ignore based on Scott’s diagnosis and progression?',
    'Do we need updated FVC/SVC, ALSFRS-R, or genetic testing before coordinators can assess eligibility?',
    'Would UCSF recommend contacting HEALEY, Coya, or any expanded-access programs now?'
  ],
  leads: [
    { title: 'HEALEY ALS Platform Trial', status: 'Worth asking doctor', note: 'Fit gates: onset ≤24 months, vital capacity ≥50%, meds stability. Path: ask UCSF/ALS doctor whether referral or coordinator contact makes sense.', score: '100/100' },
    { title: 'COYA 302 / ALSTARS', status: 'Reviewing', note: 'Fit gates: age 18–80, onset ≤28 months, ALSFRS-R ≥35, SVC ≥70%. Path: verify Scott criteria, then ask doctor/coordinator.', score: '98/100' },
    { title: 'PHENOGENE-1A / Cromolyn', status: 'Reviewing', note: 'Fit gates need extraction/review. Path: confirm mild/moderate ALS criteria, FVC/PFT needs, and SF/Sutter site availability.', score: '94/100' },
    { title: 'Dazucorilant', status: 'Reviewing', note: 'Fit gates: ENCALS/risk profile, medication stability, SOD1/tofersen caveats. Path: doctor review before coordinator contact.', score: '94/100' },
    { title: 'INS1202', status: 'Needs genetic/status fit', note: 'Fit gates: SOD1 or sporadic cohort, ALSFRS-R ≥24, disease duration ≤42 months, no prior gene/cell therapy. Path: genetic/status check first.', score: '90/100' }
  ],
  checklist: [
    ['Current city/state/country', 'Needed'],
    ['Travel willingness', 'Needed'],
    ['Symptom onset date', 'High value'],
    ['Diagnosis date', 'High value'],
    ['Genetic testing / mutation status', 'High value'],
    ['FVC/SVC breathing test', 'High value'],
    ['ALSFRS-R score', 'High value'],
    ['Current ALS medications', 'Useful'],
    ['Prior trial participation', 'Useful']
  ]
};

function render() {
  document.querySelector('#top-actions').innerHTML = data.topActions.map(x => `<li>${x}</li>`).join('');
  document.querySelector('#doctor-questions').innerHTML = data.questions.map(x => `<li>${x}</li>`).join('');
  document.querySelector('#intake-checklist').innerHTML = data.checklist.map(([a,b]) => `<div class="check"><strong>${a}</strong><span>${b}</span></div>`).join('');
  const statuses = ['Worth asking doctor', 'Reviewing', 'Needs genetic/status fit'];
  document.querySelector('#lead-board').innerHTML = statuses.map(status => `
    <div class="column"><h3>${status}</h3>
      ${data.leads.filter(l => l.status === status).map(l => `<div class="lead"><strong>${l.title}</strong><p>${l.note}</p><span class="badge">${l.score}</span></div>`).join('')}
    </div>
  `).join('');
}

const modal = document.querySelector('#modal');
let modalMode = 'lead';
document.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => {
  modalMode = btn.dataset.add;
  document.querySelector('#modal-title').textContent = modalMode === 'question' ? 'Add doctor question' : 'Add lead';
  modal.showModal();
}));
document.querySelector('#modal-save').addEventListener('click', () => {
  const title = document.querySelector('#modal-title-input').value.trim();
  const details = document.querySelector('#modal-details-input').value.trim();
  if (!title) return;
  if (modalMode === 'question') data.questions.push(title + (details ? ` — ${details}` : ''));
  else data.leads.push({ title, status: 'Reviewing', note: details || 'Submitted by care network.', score: 'New' });
  document.querySelector('#modal-title-input').value = '';
  document.querySelector('#modal-details-input').value = '';
  render();
});

document.querySelector('#lead-form').addEventListener('submit', e => {
  e.preventDefault();
  const form = new FormData(e.target);
  const link = form.get('link')?.trim();
  const note = form.get('note')?.trim();
  const name = form.get('name')?.trim();
  if (!link) return;
  const li = document.createElement('li');
  li.textContent = `${link}${note ? ' — ' + note : ''}${name ? ' (' + name + ')' : ''}`;
  document.querySelector('#inbox').prepend(li);
  e.target.reset();
});

render();
