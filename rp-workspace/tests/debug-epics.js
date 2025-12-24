const fetch = require('node-fetch');

async function debugEpics() {
    const API_URL = 'http://localhost:3000/api/v1';

    try {
        // 1. Get an existing Initiative
        console.log('--- Fetching Initiatives ---');
        const iRes = await fetch(`${API_URL}/initiatives?limit=1`);
        const iJson = await iRes.json();
        const initiative = iJson.data.items[0];

        if (!initiative) {
            console.error('No initiatives found to test with.');
            return;
        }

        console.log('Using Initiative:', initiative.title, 'ID:', initiative.initiativeId);

        // 2. Create a test Epic
        console.log('\n--- Creating Test Epic ---');
        const newEpic = {
            name: `Test Epic ${Date.now()}`,
            goal: 'Debug creation',
            initiativeId: initiative.initiativeId,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString()
        };

        const cRes = await fetch(`${API_URL}/epics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEpic)
        });

        const cJson = await cRes.json();
        console.log('Create Status:', cRes.status);
        console.log('Create Response:', JSON.stringify(cJson, null, 2));

        if (cRes.status !== 201) {
            console.error('Failed to create epic');
            return;
        }

        // 3. Fetch Epics for this Initiative
        console.log(`\n--- Fetching Epics for Initiative ${initiative.initiativeId} ---`);
        const fRes = await fetch(`${API_URL}/epics?initiativeId=${initiative.initiativeId}`);
        const fJson = await fRes.json();
        console.log('Fetch Response:', JSON.stringify(fJson, null, 2));

        const found = fJson.data.items.find(e => e.name === newEpic.name);
        if (found) {
            console.log('\nSUCCESS: Created Epic found in list.');
        } else {
            console.error('\nFAILURE: Created Epic NOT found in list.');
        }

    } catch (e) {
        console.error(e);
    }
}

debugEpics();
