const fetch = require('node-fetch');

(async () => {
    try {
        const response = await fetch('http://localhost:3000/api/v1/catalogs/priorities');
        console.log('Status:', response.status);
        const json = await response.json();
        console.log('JSON:', JSON.stringify(json, null, 2));
        console.log('Is Array?', Array.isArray(json));
        console.log('Is Data Array?', json.data && Array.isArray(json.data));
    } catch (e) {
        console.error(e);
    }
})();
