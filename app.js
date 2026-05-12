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
        formula: "Àrea = ((B + b) × h) / 2",
        inputs: ['Base Major (B)', 'base menor (b)', 'Altura (h)', 'Àrea'],
        svg: `<svg viewBox="0 0 100 100" width="150"><path d="M20,80 L80,80 L65,30 L35,30 Z" fill="#00b4d8" stroke="#002d62" stroke-width="2"/></svg>`
    },
    cercle: {
        formula: "Àrea = π × r² | Longitud = 2 × π × r",
        inputs: ['Radi', 'Àrea', 'Longitud'],
        svg: `<svg viewBox="0 0 100 100" width="150"><circle cx="50" cy="50" r="35" fill="#00b4d8" stroke="#002d62" stroke-width="2"/><line x1="50" y1="50" x2="85" y2="50" stroke="#002d62" stroke-width="2"/></svg>`
    }
};

const select = document.getElementById('polygon-select');
const displayArea = document.getElementById('display-area');
const inputsContainer = document.getElementById('inputs-container');
const calcBtn = document.getElementById('calc-btn');
const resetBtn = document.getElementById('reset-btn');

select.addEventListener('change', (e) => {
    const shape = e.target.value;
    if (!shape) {
        displayArea.classList.add('hidden');
        return;
    }

    inputsContainer.innerHTML = '';
    const data = polygonData[shape];

    document.getElementById('figure-visual').innerHTML = data.svg;
    document.getElementById('formula-text').innerText = data.formula;
    
    data.inputs.forEach(label => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <label>${label}</label>
            <input type="number" step="any" placeholder="Deixa buit per calcular..." data-label="${label}">
        `;
        inputsContainer.appendChild(div);
    });

    displayArea.classList.remove('hidden');
});

calcBtn.addEventListener('click', () => {
    const inputs = Array.from(inputsContainer.querySelectorAll('input'));
    const emptyFields = inputs.filter(i => i.value.trim() === "");
    
    if (emptyFields.length !== 1) {
        alert("Has de deixar EXACTAMENT un camp buit.");
        return;
    }

    const targetLabel = emptyFields[0].getAttribute('data-label');
    const shape = select.value;
    const vals = {};
    inputs.forEach(i => vals[i.getAttribute('data-label')] = parseFloat(i.value));

    let result = 0;

    switch (shape) {
        case 'pitagoras':
            if (targetLabel === 'Hipotenusa (c)') result = Math.sqrt(vals['Catet A']**2 + vals['Catet B']**2);
            else result = Math.sqrt(vals['Hipotenusa (c)']**2 - (vals['Catet A'] || vals['Catet B'])**2);
            break;
        case 'rectangle':
            if (targetLabel === 'Àrea') result = vals['Base'] * vals['Altura'];
            else result = vals['Àrea'] / (vals['Base'] || vals['Altura']);
            break;
        case 'triangle':
            if (targetLabel === 'Àrea') result = (vals['Base'] * vals['Altura']) / 2;
            else if (targetLabel === 'Base') result = (vals['Àrea'] * 2) / vals['Altura'];
            else result = (vals['Àrea'] * 2) / vals['Base'];
            break;
        case 'trapezi':
            const B = vals['Base Major (B)'];
            const b = vals['base menor (b)'];
            const h = vals['Altura (h)'];
            const A = vals['Àrea'];
            if (targetLabel === 'Àrea') result = ((B + b) * h) / 2;
            else if (targetLabel === 'Altura (h)') result = (2 * A) / (B + b);
            else if (targetLabel === 'Base Major (B)') result = (2 * A / h) - b;
            else if (targetLabel === 'base menor (b)') result = (2 * A / h) - B;
            break;
        case 'cercle':
            if (targetLabel === 'Àrea') result = Math.PI * vals['Radi']**2;
            else if (targetLabel === 'Longitud') result = 2 * Math.PI * vals['Radi'];
            else result = vals['Longitud'] ? vals['Longitud'] / (2 * Math.PI) : Math.sqrt(vals['Àrea'] / Math.PI);
            break;
    }

    if (!isNaN(result) && isFinite(result)) {
        emptyFields[0].value = result.toFixed(2);
        emptyFields[0].style.backgroundColor = "#dcfce7";
    } else {
        alert("Error en les dades introduïdes.");
    }
});

resetBtn.addEventListener('click', () => {
    inputsContainer.querySelectorAll('input').forEach(i => {
        i.value = "";
        i.style.backgroundColor = "white";
    });
});
