// --- GLOBAL STATE ---
let myCases = [];
let currentCaseId = null;

// --- INITIALIZE ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    fetchMyCases();
    setupEventListeners();
});

// --- 1. FETCH CASES (Pillar: Single Lawyer Logic) ---
async function fetchMyCases() {
    try {
        // Adding a timestamp ?t= avoids browser caching on 4GB RAM systems
        const response = await fetch(`/api/lawyer/my-cases?t=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-store' }
        });
        myCases = await response.json();
        renderLawyerGrid(myCases);
    } catch (err) {
        console.error("Failed to load cases:", err);
    }
}

// --- 2. RENDER GRID (Pillar: Poor Investigation & Adjournments) ---
function renderLawyerGrid(cases) {
    const grid = document.getElementById('lawyer-grid');
    if (!grid) return;

    grid.innerHTML = cases.map(c => {
        const needsEvidence = !c.evidenceChecklist.forensicsUploaded;
        const isNearLimit = c.adjournmentCount >= 2;
        const isLocked = c.adjournmentCount >= 3;

        return `
            <div class="lawyer-card">
                <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                    <small style="color: #666;">ID: #${c.caseNumber}</small>
                    <span class="${needsEvidence ? 'text-danger' : 'text-success'}">
                        ${needsEvidence ? '● Audit Pending' : '● Audit Passed'}
                    </span>
                </div>

                <h3 style="margin-bottom:15px; color: #1a1c23;">${c.title}</h3>

                <div class="adj-info ${isNearLimit ? 'limit-near' : ''}">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Adjournments: <strong>${c.adjournmentCount}/3</strong></span>
                        <button class="adj-btn" 
                                ${isLocked ? 'disabled' : ''} 
                                onclick="handleAdjournment('${c._id}', ${c.adjournmentCount})">
                            ${isLocked ? 'Locked' : 'Request'}
                        </button>
                    </div>
                </div>

                <button class="main-btn" onclick="openUploadModal('${c._id}')">
                    <i class="fas fa-file-upload"></i> Update Evidence
                </button>
            </div>
        `;
    }).join('');
}

// --- 3. MODAL LOGIC (Pillar: Evidence Audit) ---
function openUploadModal(id) {
    currentCaseId = id;
    const modal = document.getElementById('upload-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('upload-modal');
    if (modal) modal.classList.add('hidden');
    currentCaseId = null;
}

// --- 4. FORM SUBMISSION (Pillar: Upload & Audit) ---
async function handleUpload(e) {
    e.preventDefault();
    const fileInput = document.getElementById('evidence-file');
    if (!fileInput.files[0] || !currentCaseId) return;

    const formData = new FormData();
    formData.append('evidence', fileInput.files[0]);
    formData.append('caseId', currentCaseId);

    try {
        const response = await fetch('/api/lawyer/upload-evidence', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("Audit Successful: Evidence submitted for Judge review.");
            closeModal();
            fetchMyCases(); // Refresh the grid
        }
    } catch (err) {
        alert("Upload failed. Please check file format (PDF only).");
    }
}

// --- 5. ADJOURNMENT LOGIC (Pillar: Adjournment Issue) ---
async function handleAdjournment(id, currentCount) {
    if (currentCount >= 3) return;

    const confirmReq = confirm("Requesting an adjournment will increase your quota. Proceed?");
    if (!confirmReq) return;

    try {
        const res = await fetch(`/api/lawyer/request-adj/${id}`, { method: 'POST' });
        if (res.ok) {
            fetchMyCases(); // Refresh to show new count and potential 'Locked' state
        }
    } catch (err) {
        console.error("Request failed");
    }
}

function setupEventListeners() {
    const form = document.getElementById('upload-form');
    if (form) form.addEventListener('submit', handleUpload);
}