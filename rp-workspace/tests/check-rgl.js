const rgl = require('react-grid-layout');
console.log('Keys:', JSON.stringify(Object.keys(rgl)));
console.log('WidthProvider type:', typeof rgl.WidthProvider);
if (rgl.WidthProvider) {
    console.log('WidthProvider:', rgl.WidthProvider);
}
try {
    const wp = require('react-grid-layout/build/components/WidthProvider');
    console.log('Direct Require Build Success:', !!wp);
} catch (e) { console.log('Direct Require Build Failed'); }

try {
    const wpDist = require('react-grid-layout/dist/react-grid-layout.min.js');
    console.log('Direct Require Dist Success:', Object.keys(wpDist));
} catch (e) { console.log('Direct Require Dist Failed'); }
