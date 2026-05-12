// Base de dades de les figures, fórmules i camps de text
const polygonData = {
    pitagoras: {
        formula: "a² + b² = c² (Catet² + Catet² = Hipotenusa²)",
        inputs: ['Catet A', 'Catet B', 'Hipotenusa (c)'],
        svg: `<svg viewBox="0 0 100 100" width="150"><path d="M20,80 L80,80 L20,20 Z" fill="#00b4d8" stroke="#002d62" stroke-width="2"/><rect x="20" y="70" width="10" height="10" fill="none" stroke="#002d62" stroke-width="1"/></svg>`
    },
    rectangle: {
        formula: "Àrea = base × altura",
        inputs: ['Base', 'Altura', 'Àrea'],
        svg: `<svg viewBox="0 0 100 100" width="150"><rect x="20" y="30" width="60" height="40" fill="#00b4d8" stroke="#002d62" stroke-width="2"/></svg>`
    },
    triangle: {
        formula: "Àrea = (base × altura) / 2",
        inputs: ['Base', 'Altura', 'Àrea'],
        svg: `<svg viewBox="0 0 100 100" width="150"><path d="M50,20 L80,80 L20,80 Z" fill="#00b4d8" stroke="#002d62" stroke-width="2"/></svg>`
    },
    trapezi: {
        formula: "Àrea = ((Base Major + base menor) × h) / 2",
        inputs: ['Base Major', 'base menor', 'Altura', 'Àrea'],
        svg: `<svg viewBox="0 0 100 100" width="150"><path d="M20,80 L80,80 L70,30 L30,30 Z" fill="#00b4d8" stroke="#002d62" stroke-width="2"/></svg>`
    },
    cercle: {
        formula: "Àrea = π × r² | Longitud = 2 × π × r",
        inputs: ['Radi', 'Àrea', 'Longitud'],
        svg: `<svg viewBox="0 0 100 100" width="150"><circle cx="50" cy="50" r="35" fill="#00b4d8" stroke="#002d62" stroke-width="2"/><line x1="50" y1="50" x2="85" y2="50" stroke="#002d62" stroke-width="2"/></svg>`
    }
};

// Referències als elements del DOM
const select = document.getElementById('polygon-select');
const displayArea = document.getElementById('display-area');
const inputsContainer = document.getElementById('inputs-container');
const calcBtn = document.getElementById('calc-btn');
const resetBtn = document.getElementById('reset-btn');

// 1. ESCCOLTA EL CANVI EN EL DESPLEGABLE
select.addEventListener('change', (e) => {
    const shape = e.target.value;
    
    // Si no hi ha res seleccionat, amaguem l'àrea i sortim
    if (!shape) {
        displayArea.classList.add('hidden');
        return;
    }

    // NETEJA CRÍTICA: Borrem tot el que hi hagués abans
    inputsContainer.innerHTML = '';
    
    const data = polygonData[shape];

    // Actualitzem imatge i text de la fórmula
    document.getElementById('figure-visual').innerHTML = data.svg;
    document.getElementById('formula-text').innerText = data.formula;
    
    // Creem dinàmicament els inputs segons la figura
    data.inputs.forEach(label => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <label>${label}</label>
            <input type="number" step="any" placeholder="Deixa buit per calcular..." data-label="${label}">
        `;
        inputsContainer.appendChild(div);
    });

    // Mostrem l'àrea de la calculadora
    displayArea.classList.remove('hidden');
});

// 2. LÒGICA DE CÀLCUL
calcBtn.addEventListener('click', () => {
    const inputs = Array.from(inputsContainer.querySelectorAll('input'));
    const emptyFields = inputs.filter(i => i.value.trim() === "");
    
    // Validació per a l'alumne
    if (emptyFields.length !== 1) {
        alert("Recorda: has d'omplir tots els camps i deixar-ne només UN de buit, que és el que jo calcularé.");
        return;
    }

    const targetLabel = emptyFields[0].getAttribute('data-label');
    const shape = select.value;
    
    // Recollim els valors introduïts
    const vals = {};
    inputs.forEach(i => {
        vals[i.getAttribute('data-label')] = parseFloat(i.value);
    });

    let result = 0;

    // Càlculs segons la figura
    switch (shape) {
        case 'pitagoras':
            if (targetLabel === 'Hipotenusa (c)') {
                result = Math.sqrt(Math.pow(vals['Catet A'], 2) + Math.pow(vals['Catet B'], 2));
            } else {
                const conegut = vals['Catet A'] || vals['Catet B'];
                result = Math.sqrt(Math.pow(vals['Hipotenusa (c)'], 2) - Math.pow(conegut, 2));
            }
            break;

        case 'rectangle':
            if (targetLabel === 'Àrea') result = vals['Base'] * vals['Altura'];
            else if (targetLabel === 'Base') result = vals['Àrea'] / vals['Altura'];
            else result = vals['Àrea'] / vals['Base'];
            break;

        case 'triangle':
            if (targetLabel === 'Àrea') result = (vals['Base'] * vals['Altura']) / 2;
            else if (targetLabel === 'Base') result = (vals['Àrea'] * 2) / vals['Altura'];
            else result = (vals['Àrea'] * 2) / vals['Base'];
            break;

        case 'trapezi':
            if (targetLabel === 'Àrea') result = ((vals['Base Major'] + vals['base menor']) * vals['Altura']) / 2;
            else if (targetLabel === 'Altura') result = (vals['Àrea'] * 2) / (vals['Base Major'] + vals['base menor']);
            else if (targetLabel === 'Base Major') result = ((vals['Àrea'] * 2) / vals['Altura']) - vals['base menor'];
            else result = ((vals['Àrea'] * 2) / vals['Altura']) - vals['Base Major'];
            break;

        case 'cercle':
            if (targetLabel === 'Àrea') result = Math.PI * Math.pow(vals['Radi'], 2);
            else if (targetLabel === 'Longitud') result = 2 * Math.PI * vals['Radi'];
            else { // Calcular Radi
                if (vals['Àrea']) result = Math.sqrt(vals['Àrea'] / Math.PI);
                else result = vals['Longitud'] / (2 * Math.PI);
            }
            break;
    }

    // Mostrar el resultat en el camp buit amb 2 decimals i estil destacat
    if (!isNaN(result)) {
        emptyFields[0].value = result.toFixed(2);
        emptyFields[0].style.backgroundColor = "#dcfce7"; // Verd clar
        emptyFields[0].style.border = "2px solid #22c55e";
    } else {
        alert("Revisa les dades. El càlcul no és possible (per exemple, un catet no pot ser més gran que la hipotenusa).");
    }
});

// 3. BOTÓ DE NETEJA
resetBtn.addEventListener('click', () => {
    inputsContainer.querySelectorAll('input').forEach(i => {
        i.value = "";
        i.style.backgroundColor = "white";
        i.style.border = "1px solid #cbd5e1";
    });
});
