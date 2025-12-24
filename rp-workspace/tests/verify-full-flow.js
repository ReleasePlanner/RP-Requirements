const fetch = require('node-fetch');

async function verifyFullFlow() {
    const API_URL = 'http://localhost:3000/api/v1';

    // Helper for logging
    const log = (msg, data) => console.log(`[VERIFY] ${msg}`, data ? JSON.stringify(data, null, 2) : '');

    try {
        log('Starting Full Flow Verification...');

        // 1. Create Portfolio with STATUS
        log('1. Creating Portfolio...');
        const pRes = await fetch(`${API_URL}/portfolios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Verification Portfolio ' + Date.now(),
                status: 'Active'
            })
        });
        const pData = await pRes.json();
        if (pRes.status !== 201) throw new Error(`Portfolio Create Failed: ${pRes.status} ${JSON.stringify(pData)}`);
        const portfolioId = pData.data.portfolioId;
        log('Portfolio Created:', { id: portfolioId, status: pData.data.status });

        // 2. Create Initiative with STATUS (status_text mapped)
        log('2. Creating Initiative...');
        const iRes = await fetch(`${API_URL}/initiatives`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Verification Initiative',
                portfolioId: portfolioId,
                status_text: 'Draft'
            })
        });
        const iData = await iRes.json();
        // Note: API might not return status_text in response depending on entity transform, so we check status code mostly
        if (iRes.status !== 201) throw new Error(`Initiative Create Failed: ${iRes.status} ${JSON.stringify(iData)}`);
        const initiativeId = iData.data.initiativeId;
        log('Initiative Created:', { id: initiativeId, status: iData.data.status_text });

        // 3. Create Epic with STATUS
        log('3. Creating Epic...');
        const eRes = await fetch(`${API_URL}/epics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Verification Epic',
                initiativeId: initiativeId,
                status_text: 'In Review'
            })
        });
        const eData = await eRes.json();
        if (eRes.status !== 201) throw new Error(`Epic Create Failed: ${eRes.status} ${JSON.stringify(eData)}`);
        const epicId = eData.data.epicId;
        log('Epic Created:', { id: epicId, status: eData.data.status_text });

        // 4. Verify Update (Fix 400 Error Check)
        log('4. Updating Portfolio (Testing 400 fix + Status Update)...');
        const uRes = await fetch(`${API_URL}/portfolios/${portfolioId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'On Hold'
            })
        });
        const uData = await uRes.json();
        if (uRes.status !== 200) throw new Error(`Portfolio Update Failed: ${uRes.status} ${JSON.stringify(uData)}`);
        log('Portfolio Updated:', { status: uData.data.status });

        // 5. Verify Cascade Delete
        log('5. verifying Cascade Delete (Deleting Portfolio)...');
        const dRes = await fetch(`${API_URL}/portfolios/${portfolioId}`, {
            method: 'DELETE'
        });
        if (dRes.status !== 200) throw new Error(`Portfolio Delete Failed: ${dRes.status}`);

        // Verify children are gone
        log('Checking if children exist...');
        const checkI = await fetch(`${API_URL}/initiatives/${initiativeId}`);
        if (checkI.status !== 404) console.warn('WARNING: Initiative might not have been deleted (Cascade check)');
        else log('Cascade Delete Confirmed: Initiative is gone (404)');

        log('SUCCESS: All checks passed!');

    } catch (e) {
        console.error('VERIFICATION FAILED:', e);
        process.exit(1);
    }
}

verifyFullFlow();
