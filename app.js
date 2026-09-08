const deepCopy = obj => JSON.parse(JSON.stringify(obj));

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.packs)) return saved;
  } catch (error) {
    console.warn('Could not load saved course', error);
  }
  return deepCopy(defaultState);
}

let state = loadState();
let editingPackId = null;

const packList = document.getElementById('packList');
const courseTitle = document.getElementById('courseTitle');
courseTitle.value = state.title;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function codeNumber(code) {
  return Number(code.replace(/\D/g, '')) || 0;
}

function sortCodes(codes) {
  return [...codes].sort((a, b) => codeNumber(a) - codeNumber(b));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function pillHtml(code) {
  const type = code.charAt(0).toLowerCase();
  return `<button class="pill ${type}" type="button" data-code="${code}" title="View ${code} wording">${code}</button>`;
}

function groupHtml(label, codes) {
  return `
    <div class="group">
      <div class="group-name">${label}</div>
      <div class="pills">${codes.length ? sortCodes(codes).map(pillHtml).join('') : '<span class="empty">None linked</span>'}</div>
    </div>`;
}

function render() {
  packList.innerHTML = state.packs.map((pack, index) => `
    <article class="pack-card" data-id="${pack.id}">
      <div class="pack-head">
        <button class="drag-handle" type="button" aria-label="Drag to reorder" title="Drag to reorder">≡</button>
        <input class="pack-title" value="${escapeHtml(pack.name)}" data-pack-title="${pack.id}" aria-label="Pack ${index + 1} title" />
        <div class="pack-number">PACK ${String(index + 1).padStart(2, '0')}</div>
      </div>
      <div class="pack-body">
        ${groupHtml('Skills', pack.s || [])}
        ${groupHtml('Knowledge', pack.k || [])}
        ${groupHtml('Behaviours', pack.b || [])}
      </div>
      <div class="pack-actions">
        <button class="btn" type="button" data-edit="${pack.id}">Edit mapping</button>
        <button class="btn ghost danger" type="button" data-delete="${pack.id}">Remove pack</button>
      </div>
    </article>
  `).join('');
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1500);
}

function getPack(id) {
  return state.packs.find(pack => pack.id === id);
}

function openDetails(code) {
  document.getElementById('detailsTitle').textContent = code.startsWith('K') ? 'Knowledge' : code.startsWith('S') ? 'Skill' : 'Behaviour';
  document.getElementById('detailsCode').textContent = code;
  document.getElementById('detailsText').textContent = criteria[code] || 'No wording available.';
  openModal('detailsModal');
}

function renderEditModal(packId) {
  const pack = getPack(packId);
  if (!pack) return;
  editingPackId = packId;
  document.getElementById('editTitle').textContent = `Edit · ${pack.name}`;

  const makeRows = (type, title, values) => {
    const codes = Object.keys(criteria).filter(code => code.startsWith(type)).sort((a,b) => codeNumber(a) - codeNumber(b));
    return `
      <section class="criteria-section">
        <h3>${title}</h3>
        ${codes.map(code => `
          <label class="criteria-row">
            <input type="checkbox" data-map-code="${code}" ${values.includes(code) ? 'checked' : ''} />
            <span class="criteria-code">${code}</span>
            <span class="criteria-text">${escapeHtml(criteria[code])}</span>
          </label>`).join('')}
      </section>`;
  };

  document.getElementById('editBody').innerHTML =
    makeRows('S', 'Skills', pack.s || []) +
    makeRows('K', 'Knowledge', pack.k || []) +
    makeRows('B', 'Behaviours', pack.b || []);
  openModal('editModal');
}

function previewHtml() {
  return `
    <div class="course-box" style="box-shadow:none;margin-bottom:12px">
      <div class="label">Course</div>
      <div style="font-size:20px;font-weight:800">${escapeHtml(state.title || 'Untitled course')}</div>
      <div class="course-meta">ST0095 · Version 1.2 · ${state.packs.length} pack${state.packs.length === 1 ? '' : 's'}</div>
    </div>
    ${state.packs.map((pack, index) => `
      <section class="preview-pack">
        <h3>${index + 1}. ${escapeHtml(pack.name)}</h3>
        <div class="preview-line"><strong>Skills:</strong> ${sortCodes(pack.s || []).join(', ') || 'None'}</div>
        <div class="preview-line"><strong>Knowledge:</strong> ${sortCodes(pack.k || []).join(', ') || 'None'}</div>
        <div class="preview-line"><strong>Behaviours:</strong> ${sortCodes(pack.b || []).join(', ') || 'None'}</div>
      </section>`).join('')}`;
}

function qrPayload() {
  return JSON.stringify({
    type: 'naxos-course',
    schema: 1,
    standard: state.standard,
    version: state.version,
    title: state.title.trim() || 'Untitled course',
    packs: state.packs.map(pack => ({
      name: pack.name.trim() || 'Untitled pack',
      s: sortCodes(pack.s || []),
      k: sortCodes(pack.k || []),
      b: sortCodes(pack.b || [])
    }))
  });
}

function createQR() {
  const target = document.getElementById('qrTarget');
  target.innerHTML = '';
  if (typeof QRCode === 'undefined') {
    target.innerHTML = '<p class="qr-note">QR generator could not load. Check the connection and reopen Naxos.</p>';
    openModal('qrModal');
    return;
  }
  const payload = qrPayload();
  new QRCode(target, {
    text: payload,
    width: 280,
    height: 280,
    colorDark: '#111111',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  });
  openModal('qrModal');
}

courseTitle.addEventListener('input', event => {
  state.title = event.target.value;
  saveState();
});

document.getElementById('addPackBtn').addEventListener('click', () => {
  const id = `pack-${Date.now()}`;
  state.packs.push({ id, name: `New Pack ${state.packs.length + 1}`, s: [], k: [], b: [] });
  saveState();
  render();
  showToast('Pack added');
  requestAnimationFrame(() => {
    const input = document.querySelector(`[data-pack-title="${id}"]`);
    input?.focus();
    input?.select();
  });
});

document.getElementById('previewBtn').addEventListener('click', () => {
  document.getElementById('previewBody').innerHTML = previewHtml();
  openModal('previewModal');
});

document.getElementById('qrBtn').addEventListener('click', createQR);

packList.addEventListener('input', event => {
  const id = event.target.dataset.packTitle;
  if (!id) return;
  const pack = getPack(id);
  if (!pack) return;
  pack.name = event.target.value;
  saveState();
});

packList.addEventListener('click', event => {
  const codeButton = event.target.closest('[data-code]');
  if (codeButton) {
    openDetails(codeButton.dataset.code);
    return;
  }
  const editButton = event.target.closest('[data-edit]');
  if (editButton) {
    renderEditModal(editButton.dataset.edit);
    return;
  }
  const deleteButton = event.target.closest('[data-delete]');
  if (deleteButton) {
    const pack = getPack(deleteButton.dataset.delete);
    if (!pack) return;
    if (!confirm(`Remove “${pack.name}”?`)) return;
    state.packs = state.packs.filter(item => item.id !== pack.id);
    saveState();
    render();
    showToast('Pack removed');
  }
});

document.getElementById('editBody').addEventListener('change', event => {
  const code = event.target.dataset.mapCode;
  if (!code || !editingPackId) return;
  const pack = getPack(editingPackId);
  if (!pack) return;
  const key = code.charAt(0).toLowerCase();
  const list = pack[key] || (pack[key] = []);
  if (event.target.checked && !list.includes(code)) list.push(code);
  if (!event.target.checked) pack[key] = list.filter(item => item !== code);
  pack[key] = sortCodes(pack[key]);
  saveState();
  render();
});

document.addEventListener('click', event => {
  const close = event.target.closest('[data-close]');
  if (close) closeModal(close.dataset.close);
  if (event.target.classList.contains('modal-backdrop')) closeModal(event.target.id);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(modal => closeModal(modal.id));
  }
});

if (typeof Sortable !== 'undefined') {
  new Sortable(packList, {
    animation: 160,
    handle: '.drag-handle',
    ghostClass: 'sortable-ghost',
    onEnd: () => {
      const orderedIds = [...packList.querySelectorAll('.pack-card')].map(card => card.dataset.id);
      state.packs = orderedIds.map(id => getPack(id)).filter(Boolean);
      saveState();
      render();
      showToast('Pack order saved');
    }
  });
}

render();
