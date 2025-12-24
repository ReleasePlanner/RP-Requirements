const fetch = require('node-fetch');

async function verifyUpdate() {
    const API_URL = 'http://localhost:3000/api/v1';

    try {
        // 1. Get a portfolio
        console.log('--- Fetching Portfolios ---');
        const res = await fetch(`${API_URL}/portfolios?limit=1`);
        const json = await res.json();
        const portfolio = json.data.items[0];

        if (!portfolio) {
            console.error('No portfolio found');
            return;
        }

        console.log('Testing update on:', portfolio.name, 'ID:', portfolio.portfolioId);

        // 2. Try PATCH with sponsorId
        const payload = {
            name: portfolio.name, // Keep same name
            sponsorId: '493d89aa-e474-44da-b330-edcaf8121757' // Known sponsor UUID from seed
        };

        console.log('Sending Payload:', JSON.stringify(payload));

        const updateRes = await fetch(`${API_URL}/portfolios/${portfolio.portfolioId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const updateJson = await updateRes.json();
        console.log('Update Status:', updateRes.status);
        console.log('Update Response:', JSON.stringify(updateJson, null, 2));

    } catch (e) {
        console.error(e);
    }
}

verifyUpdate();
