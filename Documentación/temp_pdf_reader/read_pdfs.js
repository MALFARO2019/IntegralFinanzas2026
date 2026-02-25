const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    const files = [
        'C:\\AntiGravityDev\\IntegralFinanzas2026\\Documentación\\Análisis de Aplicaciones de Finanzas Personales.pdf',
        'C:\\AntiGravityDev\\IntegralFinanzas2026\\Documentación\\Benchmark_apps_deuda_creditos.pdf',
        'C:\\AntiGravityDev\\IntegralFinanzas2026\\Documentación\\Investigación Detallada de BlueCoins.pdf'
    ];
    
    for (const f of files) {
        console.log(`------------- Leyendo ${f} -------------`);
        try {
            const dataBuffer = fs.readFileSync(f);
            const data = await pdf(dataBuffer);
            console.log(data.text.substring(0, 3000));
            console.log('\n\n\n');
        } catch(e) {
            console.log(`Error reading ${f}:`, e);
        }
    }
}
extract();
