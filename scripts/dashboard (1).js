let currentPage = 1;
let lastCheckTime = new Date().toISOString();

function fetchDashboardData() {
  fetchDailyCauseList(currentPage);
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDailyCauseList(1);
  startLiveWatcher();
  setupEventListeners();
});

async function fetchDailyCauseList(page = 1) {
  if (page < 1) return;

  try {
    const response = await fetch(`/api/judge/cause-list?page=${page}&judgeId=judge_001`, {
      headers: { 'Cache-Control': 'no-store' }
    });

    if (response.status === 404) {
      console.error('Route not found: /api/judge/cause-list');
      return;
    }
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.backlog) || !Array.isArray(data.fresh)) {
      console.error('Invalid response format', data);
      return;
    }

    renderColumn('backlog-list', data.backlog, true);
    renderColumn('fresh-list', data.fresh, false);

    const pageCounter = document.getElementById('pageCounter');
    if (pageCounter) {
      pageCounter.innerText = `Page ${data.currentPage || page} of ${data.totalPages || 1}`;
    }

    currentPage = data.currentPage || page;
  } catch (err) {
    console.error('Dashboard Load Error:', err);
  }
}

function renderColumn(containerId, cases = [], isBacklog = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!cases.length) {
    container.innerHTML = '<div class="empty">No cases to display</div>';
    return;
  }

  container.innerHTML = cases.map(c => {
    const hasStay = !!c.stayOrder?.isActive;
    const poorInvestigation = !c.evidenceChecklist?.forensicsUploaded;
    const limitReached = (c.adjournmentCount || 0) >= 2;

    return `
      <div class="case-card ${isBacklog ? 'card-backlog' : 'card-fresh'}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <span class="case-id">#${c.caseNumber || '--'}</span>
          <span class="card-tag ${hasStay || poorInvestigation ? 'tag-stay' : 'tag-ready'}">${hasStay ? 'STAY ACTIVE' : (poorInvestigation ? 'POOR INVESTIGATION' : 'READY')}</span>
        </div>
        <h4 style="margin:12px 0; color:#1a1c23;">${c.title || 'Untitled Case'}</h4>
        <div style="display:flex; gap:15px; font-size:12px; color:#6b7280;">
          <span><i class="fas fa-history"></i> ${isBacklog ? 'Backlog' : 'New'}</span>
          <span style="${limitReached ? 'color:red;font-weight:bold' : ''}"><i class="fas fa-ban"></i> Adj: ${c.adjournmentCount || 0}/3</span>
        </div>
        <button class="btn-action" style="margin-top:15px; width:100%;" onclick="openAnalysisModal('${c._id || ''}')">Analyze File</button>
      </div>
    `;
  }).join('');
}

function openAnalysisModal(caseId) {
  const modal = document.getElementById('case-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('case-modal');
  if (modal) modal.classList.add('hidden');
}

function startLiveWatcher() {
  setInterval(async () => {
    try {
      const res = await fetch(`/api/judge/live-check?since=${encodeURIComponent(lastCheckTime)}`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.newUpdates) {
        const toast = document.getElementById('toast');
        if (toast) toast.classList.remove('hidden');
        lastCheckTime = data.timestamp || new Date().toISOString();
      }
    } catch (err) {
      console.error('Live watcher failed', err);
    }
  }, 60000);
}

function setupEventListeners() {
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  if (nextBtn) nextBtn.onclick = () => fetchDailyCauseList(currentPage + 1);
  if (prevBtn) prevBtn.onclick = () => fetchDailyCauseList(Math.max(1, currentPage - 1));

  window.onclick = (event) => {
    const modal = document.getElementById('case-modal');
    if (modal && event.target === modal) closeModal();
  };
}
