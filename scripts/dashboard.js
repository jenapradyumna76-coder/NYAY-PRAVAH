const API_BASE = 'http://localhost:4000/api';
const isJudgeDashboard = document.title.includes('Judicial Command Center');

function getTodayIsoDate() {
    return new Date().toISOString().split('T')[0];
}

function statusLabel(status) {
    if (status === 'adjoined') return 'Adjoined';
    if (status === 'stay') return 'Stay';
    if (status === 'rehearing') return 'Re-hearing';
    return 'Pending';
}

function statusClass(status) {
    if (status === 'adjoined') return 'status-adjoined';
    if (status === 'stay') return 'status-stay';
    if (status === 'rehearing') return 'status-rehearing';
    return 'status-pending';
}

function showActionMessage(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        alert(message);
        return;
    }

    const messageNode = toast.querySelector('span');
    if (messageNode) {
        messageNode.textContent = message;
    }
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2400);
}

function updateBalanceMeter(backlogCount, freshCount) {
    const backlogSegment = document.querySelector('.backlog-seg');
    const freshSegment = document.querySelector('.fresh-seg');

    if (!backlogSegment || !freshSegment) return;

    const total = backlogCount + freshCount;
    const backlogWidth = total === 0 ? 50 : (backlogCount / total) * 100;
    const freshWidth = total === 0 ? 50 : (freshCount / total) * 100;

    backlogSegment.style.width = `${backlogWidth}%`;
    freshSegment.style.width = `${freshWidth}%`;
    backlogSegment.textContent = `${backlogCount} BACKLOG`;
    freshSegment.textContent = `${freshCount} FRESH`;
}

function updateLoadButtonVisibility(allFinished) {
    if (!isJudgeDashboard) return;
    const button = document.getElementById('loadNewCasesBtn');
    if (!button) return;
    button.classList.toggle('hidden', !allFinished);
}

function renderCases(cases, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!cases || cases.length === 0) {
        container.innerHTML = '<div class="empty-cases">No unfinished cases in this section.</div>';
        return;
    }

    container.innerHTML = cases.map((caseData) => {
        const selectedDate = caseData.actionDate || getTodayIsoDate();
        return `
        <div class="case-item" data-case-id="${caseData.id}" title="${caseData.description}">
            <div class="case-header">
                <span class="case-sl">#${caseData.sl}</span>
                <span class="case-id">${caseData.id}</span>
            </div>
            <div class="case-name">${caseData.name}</div>
            <div class="case-description-tooltip">${caseData.description}</div>
            ${isJudgeDashboard ? `
            <div class="case-action-panel">
                <div class="case-action-top-row">
                    <span class="case-status-chip ${statusClass(caseData.status)}">${statusLabel(caseData.status)}</span>
                    <input type="date" class="case-date-input" value="${selectedDate}">
                </div>
                <div class="case-action-buttons">
                    <button type="button" class="case-action-btn btn-stay" data-action="stay">Mark Stay</button>
                    <button type="button" class="case-action-btn btn-rehearing" data-action="rehearing">Re-hearing</button>
                    <button type="button" class="case-action-btn btn-adjoined" data-action="adjoined">Mark Adjoined</button>
                </div>
            </div>` : ''}
        </div>`;
    }).join('');
}

async function apiGetView() {
    const response = await fetch(`${API_BASE}/dashboard/view`);
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Unable to load dashboard data.');
    }
    return payload;
}

async function apiUpdateCase(caseId, action, actionDate) {
    const response = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, actionDate, actor: 'judge' })
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Unable to update case.');
    }
    return payload;
}

async function apiLoadNewCases() {
    const response = await fetch(`${API_BASE}/cases/load-new`, { method: 'POST' });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Unable to load new cases.');
    }
    return payload;
}

function renderView(viewPayload) {
    renderCases(viewPayload.backlog, 'backlog-list');
    renderCases(viewPayload.fresh, 'fresh-list');
    updateBalanceMeter(viewPayload.counts.backlog, viewPayload.counts.fresh);
    updateLoadButtonVisibility(viewPayload.allFinished);
}

async function fetchDashboardData() {
    try {
        const payload = await apiGetView();
        renderView(payload);
    } catch (error) {
        showActionMessage('Backend not reachable. Start backend on port 4000.');
        console.error(error);
    }
}

async function handleCaseAction(event) {
    if (!isJudgeDashboard) return;

    const actionButton = event.target.closest('.case-action-btn');
    if (!actionButton) return;

    const caseItem = actionButton.closest('.case-item');
    if (!caseItem) return;

    const caseId = caseItem.getAttribute('data-case-id');
    const action = actionButton.getAttribute('data-action');
    const dateInput = caseItem.querySelector('.case-date-input');
    const actionDate = dateInput ? dateInput.value : '';

    if (!actionDate) {
        showActionMessage('Please select a date before updating status.');
        return;
    }

    try {
        const payload = await apiUpdateCase(caseId, action, actionDate);
        renderView(payload);
        const actionText = action === 'rehearing' ? 'Re-hearing' : action === 'adjoined' ? 'Adjoined' : 'Stay';
        showActionMessage(`Case ${caseId} marked ${actionText} for ${actionDate}.`);
    } catch (error) {
        showActionMessage(error.message);
    }
}

async function handleLoadNewCases() {
    try {
        const payload = await apiLoadNewCases();
        renderView(payload.view);
        showActionMessage(payload.reason || 'New cases loaded.');
    } catch (error) {
        showActionMessage(error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchDashboardData();

    if (isJudgeDashboard) {
        document.addEventListener('click', handleCaseAction);
        const loadBtn = document.getElementById('loadNewCasesBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', handleLoadNewCases);
        }
    }
});

window.fetchDashboardData = fetchDashboardData;
