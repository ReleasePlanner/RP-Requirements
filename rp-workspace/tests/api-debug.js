const fetch = require('node-fetch');

async function debugApi() {
    try {
        console.log('--- Fetching Portfolios ---');
        const pRes = await fetch('http://localhost:3000/api/v1/portfolios?limit=1');
        const pJson = await pRes.json();
        console.log('Status:', pRes.status);
        console.log('Body:', JSON.stringify(pJson, null, 2));

        if (pJson.items && pJson.items.length > 0) {
            const pid = pJson.items[0].portfolioId;
            console.log('\n--- Fetching Initiatives for Portfolio:', pid, '---');
            const iRes = await fetch(`http://localhost:3000/api/v1/initiatives?portfolioId=${pid}`);
            const iJson = await iRes.json();
            console.log('Body:', JSON.stringify(iJson, null, 2));
        }

    } catch (e) {
        console.error(e);
    }
}

debugApi();
