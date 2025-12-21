const fetch = require('node-fetch');

async function verifyRules() {
    const API_URL = 'http://localhost:3000/api/v1';
    const log = (msg, status) => console.log(`[RULE CHECK] ${msg} ${status || ''}`);

    try {
        log('--- Starting Rule Verification ---');

        // 1. Create Portfolio
        const pRes = await fetch(`${API_URL}/portfolios`, {
            method: 'POST', body: JSON.stringify({ name: 'Rule Test Portfolio', status: 'Active' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const pData = await pRes.json();
        const portfolioId = pData.data.portfolioId;
        log(`Created Portfolio`, portfolioId);

        // 2. Create ACTIVE Initiative
        const iRes = await fetch(`${API_URL}/initiatives`, {
            method: 'POST', body: JSON.stringify({ title: 'Active Init', portfolioId, status_text: 'ACTIVE' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const iData = await iRes.json();
        const initiativeId = iData.data.initiativeId;
        log(`Created ACTIVE Initiative`, initiativeId);

        // 3. Attempt to Delete Portfolio (Should FAIL)
        log('Attempting to delete Portfolio with Active Initiative...');
        const dRes1 = await fetch(`${API_URL}/portfolios/${portfolioId}`, { method: 'DELETE' });
        if (dRes1.status === 200) {
            console.error('FAIL: Portfolio deleted but should have been blocked!');
            process.exit(1);
        } else {
            const err = await dRes1.json();
            log('SUCCESS: Blocked Delete', `${dRes1.status} - ${JSON.stringify(err)}`);
        }

        // 4. Update Initiative to INACTIVE
        log('Updating Initiative to INACTIVE...');
        await fetch(`${API_URL}/initiatives/${initiativeId}`, {
            method: 'PATCH', body: JSON.stringify({ status_text: 'INACTIVE' }),
            headers: { 'Content-Type': 'application/json' }
        });

        // 5. Attempt Delete Portfolio (Should SUCCEED)
        log('Attempting verify delete after status change...');
        const dRes2 = await fetch(`${API_URL}/portfolios/${portfolioId}`, { method: 'DELETE' });
        if (dRes2.status === 200) {
            log('SUCCESS: Portfolio deleted as expected (children inactive/deleted via cascade)');
        } else {
            console.error('FAIL: Could not delete portfolio even after deactivating children', dRes2.status);
        }

        // --- INITIATIVE -> EPIC CHECK ---

        // Re-create parent for test
        const pRes2 = await fetch(`${API_URL}/portfolios`, {
            method: 'POST', body: JSON.stringify({ name: 'Rule Test P2', status: 'Active' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const pid2 = (await pRes2.json()).data.portfolioId;

        // Create Initiative
        const iRes2 = await fetch(`${API_URL}/initiatives`, {
            method: 'POST', body: JSON.stringify({ title: 'Init With Active Epic', portfolioId: pid2, status_text: 'ACTIVE' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const iid2 = (await iRes2.json()).data.initiativeId;

        // Create ACTIVE Epic
        const eRes = await fetch(`${API_URL}/epics`, {
            method: 'POST', body: JSON.stringify({ name: 'Active Epic', initiativeId: iid2, status_text: 'ACTIVE' }),
            headers: { 'Content-Type': 'application/json' }
        });
        log('Created ACTIVE Epic for Initiative');

        // Attempt Delete Initiative
        const dRes3 = await fetch(`${API_URL}/initiatives/${iid2}`, { method: 'DELETE' });
        if (dRes3.status === 200) {
            console.error('FAIL: Initiative deleted with ACTIVE Epic!');
            process.exit(1);
        } else {
            log('SUCCESS: Blocked Initiative Delete', dRes3.status);
        }

        log('--- All Rules Verified ---');

    } catch (e) {
        console.error(e);
    }
}

verifyRules();
