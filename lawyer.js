async function loadLawyerDashboard() {
    const response = await fetch('/api/lawyer/my-cases');
    const cases = await response.json();
    
    const container = document.getElementById('lawyer-case-list');
    container.innerHTML = '';

    cases.forEach(c => {
        const card = document.createElement('div');
        card.className = 'lawyer-card';
        
        // Logic for Adjournment Warning
        const adjWarning = c.adjournmentCount >= 2 ? 'limit-near' : '';
        
        card.innerHTML = `
            <div class="card-status">${c.status}</div>
            <h3>Case #${c.caseNumber}</h3>
            
            <div class="audit-box">
                <p><strong>Evidence Audit:</strong></p>
                <span class="${c.evidenceChecklist.forensicsUploaded ? 'text-success' : 'text-danger'}">
                    ${c.evidenceChecklist.forensicsUploaded ? '● Forensics OK' : '○ Forensics Missing'}
                </span>
            </div>

            <div class="adj-info ${adjWarning}">
                <label>Adjournments: ${c.adjournmentCount}/3</label>
                <button ${c.adjournmentCount >= 3 ? 'disabled' : ''} 
                        onclick="requestAdjournment('${c._id}')" class="adj-btn">
                    ${c.adjournmentCount >= 3 ? 'Limit Reached' : 'Request Delay'}
                </button>
            </div>

            <button onclick="openUploadModal('${c._id}')" class="main-btn">Update Investigation File</button>
        `;
        container.appendChild(card);
    });
}
