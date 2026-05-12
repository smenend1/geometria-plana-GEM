const polygonData = {
    pitagoras: {
        formula: "a² + b² = c² (Catet² + Catet² = Hipotenusa²)",
        inputs: ['Catet A', 'Catet B', 'Hipotenusa (c)'],
        svg: `<svg viewBox="0 0 100 100"><path d="M20,80 L80,80 L20,20 Z" fill="#00b4d8" stroke="#002d62" stroke-width="2"/></svg>`
    },
    rectangle: {
        formula: "Àrea = base × altura",
        inputs: ['Base', 'Altura', 'Àrea'],
        svg: `<svg viewBox="0 0 100 100"><rect x="20" y="30" width="60" height="40" fill="#00b4d8" stroke="#002d62" stroke-width="2"/></svg>`
    },
    triangle: {
        formula: "Àrea = (base × altura) / 2",
        inputs: ['Base', 'Altura', 'Àrea'],
        svg: `<svg viewBox="0 0 100 100"><path d="M50,20 L80,80 L20,80 Z" fill="#00b4d8" stroke="#002d62" stroke-width="2"/></svg>`
    },
    cercle: {
        formula: "Àrea = π × r² | Longitud = 2 × π × r",
        inputs: ['Radi', 'Àrea', 'Longitud'],
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="#00b4d8" stroke="#002d62" stroke-width="2"/></svg>`
    }
};

const select = document.getElementById('polygon-select');
const displayArea = document.getElementById('display-area');
const inputsContainer = document.getElementById('inputs-container');

select.addEventListener('change', (e) => {
    const shape = e.target.value;
    if (!shape) {
        displayArea.classList.add('hidden');
        return;
    }

    const data = polygonData[shape];
    document.getElementById('figure-visual').innerHTML = data.svg;
    document.getElementById('formula-text').innerText = data.formula;
    
    inputsContainer.innerHTML = '';
    data.inputs.forEach(label => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <label>${label}</label>
            <input type="number" step="any" placeholder="Introdueix valor..." data-label="${label}">
        `;
        inputsContainer.appendChild(div);
    });

    displayArea.classList.remove('hidden');
});

document.getElementById('calc-btn').addEventListener('click', () => {
    const inputs = Array.from(inputsContainer.querySelectorAll('input'));
    const emptyFields = inputs.filter(i => i.value === "");
    
    if (emptyFields.length !== 1) {
        alert("Sempre has de deixar EXACTAMENT un camp buit per calcular-lo.");
        return;
    }

    const target = emptyFields[0].getAttribute('data-label');
    const shape = select.value;
    const vals = {};
    inputs.forEach(i => vals[i.getAttribute('data-label')] = parseFloat(i.value));

    let result;

    if (shape === 'pitagoras') {
        if (target === 'Hipotenusa (c)') result = Math.sqrt(vals['Catet A']**2 + vals['Catet B']**2);
        else result = Math.sqrt(vals['Hipotenusa (c)']**2 - (vals['Catet A'] || vals['Catet B'])**2);
    } 
    else if (shape === 'rectangle') {
        if (target === 'Àrea') result = vals['Base'] * vals['Altura'];
        else result = vals['Àrea'] / (vals['Base'] || vals['Altura']);
    }
    else if (shape === 'triangle') {
        if (target === 'Àrea') result = (vals['Base'] * vals['Altura']) / 2;
        else if (target === 'Base') result = (vals['Àrea'] * 2) / vals['Altura'];
        else result = (vals['Àrea'] * 2) / vals['Base'];
    }
    else if (shape === 'cercle') {
        if (target === 'Àrea') result = Math.PI * (vals['Radi']**2);
        else if (target === 'Longitud') result = 2 * Math.PI * vals['Radi'];
        else result = vals['Longitud'] ? vals['Longitud'] / (2 * Math.PI) : Math.sqrt(vals['Àrea'] / Math.PI);
    }

    emptyFields[0].value = result.toFixed(2);
    emptyFields[0].style.backgroundColor = "#dcfce7"; // Color verd suau per indicar el resultat
});

document.getElementById('reset-btn').addEventListener('click', () => {
    inputsContainer.querySelectorAll('input').forEach(i => {
        i.value = "";
        i.style.backgroundColor = "white";
    });
});