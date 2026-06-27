// e:/web/adab/script.js

const moduleCategories = [
    {
        id: 'mod',
        title: 'Modification',
        options: [
            { id: 'M', code: 'M', label: 'Modification permitted (M)', desc: 'Allows changes to the original work' },
            { id: 'NM', code: 'NM', label: 'Modification forbidden (NM)', desc: 'No changes allowed to the original work', isDefault: true },
            { id: 'mod_none', code: '', label: 'Unspecified', desc: 'Assumes default (NM)' }
        ]
    },
    {
        id: 'attr',
        title: 'Attribution',
        options: [
            { id: 'A', code: 'A', label: 'Attribution required (A)', desc: 'Credit must be given to the creator' },
            { id: 'attr_none', code: '', label: 'Unspecified', desc: 'No attribution required' }
        ]
    },
    {
        id: 'comm',
        title: 'Commercial Use',
        options: [
            { id: 'C', code: 'C', label: 'Commercial use permitted (C)', desc: 'Allows commercial exploitation' },
            { id: 'NC', code: 'NC', label: 'Using SOURCE for non-commercial use only (NC)', desc: 'Restricts use to non-commercial purposes', isDefault: true },
            { id: 'comm_none', code: '', label: 'Unspecified', desc: 'Assumes default (NC: Using SOURCE for non-commercial use only)' }
        ]
    },
    {
        id: 'share',
        title: 'Share-alike',
        options: [
            { id: 'S', code: 'S', label: 'Share-alike required (S)', desc: 'Derivatives must use the same license' },
            { id: 'NS', code: 'NS', label: 'Share-alike encouraged (NS)', desc: 'Not required, but encouraged' },
            { id: 'share_none', code: '', label: 'Unspecified', desc: 'No share-alike terms' }
        ]
    },
    {
        id: 'deriv',
        title: 'Derivative Distribution',
        options: [
            { id: 'D', code: 'D', label: 'Distribution of modified versions is permitted (D)', desc: 'You can share modified versions' },
            { id: 'ND', code: 'ND', label: 'No derivative distribution (ND)', desc: 'You cannot share modified versions', isDefault: true },
            { id: 'deriv_none', code: '', label: 'Unspecified', desc: 'Assumes default (ND)' }
        ]
    },
    {
        id: 'redist',
        title: 'Redistribution',
        options: [
            { id: 'R', code: 'R', label: 'Redistribution of the original, unmodified work is permitted (R)', desc: 'You can share the original work' },
            { id: 'NR', code: 'NR', label: 'Redistribution of the original, unmodified work is prohibited (NR)', desc: 'You cannot share the original work', isDefault: true },
            { id: 'redist_none', code: '', label: 'Unspecified', desc: 'Assumes default (NR)' }
        ]
    },
    {
        id: 'source',
        title: 'Source Availability',
        options: [
            { id: 'SO', code: 'SO', label: 'Source must be available (SO)', desc: 'Source code/files must be provided' },
            { id: 'source_none', code: '', label: 'Unspecified', desc: 'Source not required' }
        ]
    },
    {
        id: 'ai',
        title: 'AI Training',
        options: [
            { id: 'T', code: 'T', label: 'AI training permitted (T)', desc: 'Can be used to train AI models' },
            { id: 'NT', code: 'NT', label: 'AI training forbidden (NT)', desc: 'Cannot be used to train AI models', isDefault: true },
            { id: 'ai_none', code: '', label: 'Unspecified', desc: 'Assumes default (NT)' }
        ]
    },
    {
        id: 'revoc',
        title: 'Revocability',
        options: [
            { id: 'REV', code: 'REV', label: 'License is revocable (REV)', desc: 'Creator can revoke the license later' },
            { id: 'IRR', code: 'IRR', label: 'Irrevocable (IRR)', desc: 'License cannot be revoked', isDefault: true },
            { id: 'revoc_none', code: '', label: 'Unspecified', desc: 'Assumes default (IRR)' }
        ]
    },
    {
        id: 'pub',
        title: 'Public Domain',
        options: [
            { id: 'P', code: 'P', label: 'Public Domain (P)', desc: 'Dedicated to the public domain' },
            { id: 'pub_none', code: '', label: 'Unspecified', desc: 'Not public domain' }
        ]
    }
];

// Defined order for single-letter codes to form a neat string (e.g. MACD)
const singleLetterOrder = ['M', 'A', 'C', 'S', 'D', 'R', 'T', 'P'];

const contradictions = [
    { codes: ['P', 'S'], message: 'Public Domain (P) and Share-alike (S) cannot be used together.' },
    { codes: ['P', 'SO'], message: 'Public Domain (P) cannot require Source availability (SO).' },
    { codes: ['S', 'NM'], message: 'Share-alike (S) requires Modification (M) to be permitted.' },
    { codes: ['D', 'NM'], message: 'Distribution of derivatives (D) requires Modification (M) to be permitted.' },
    { codes: ['T', 'NT'], message: 'Cannot simultaneously permit and forbid AI Training.' },
    { codes: ['REV', 'IRR'], message: 'License cannot be both Revocable and Irrevocable.' }
];

document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    setupListeners();
    updateLicense();
});

function renderGrid() {
    const grid = document.getElementById('moduleGrid');
    
    moduleCategories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'module-card';
        
        let optionsHtml = '';
        cat.options.forEach((opt, index) => {
            // Default to 'unspecified' (the one with no code) being checked, or handle defaults differently
            const isChecked = opt.code === '' ? 'checked' : '';
            
            optionsHtml += `
                <label class="option-label">
                    <input type="radio" name="${cat.id}" value="${opt.code}" ${isChecked} data-label="${opt.label}">
                    <div class="custom-radio"></div>
                    <div class="option-text">
                        <span class="option-title">${opt.label}</span>
                        ${opt.code ? `<span class="option-code">${opt.desc}</span>` : `<span class="option-code" style="color:var(--text-secondary)">${opt.desc}</span>`}
                    </div>
                </label>
            `;
        });
        
        card.innerHTML = `
            <div class="module-header">
                <div class="module-title">${cat.title}</div>
            </div>
            <div class="module-options">
                ${optionsHtml}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function setupListeners() {
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', updateLicense);
    });
    
    document.getElementById('copyBtn').addEventListener('click', () => {
        const text = document.getElementById('licenseOutput').innerText;
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copyBtn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        });
    });

    document.getElementById('viewBtn').addEventListener('click', () => {
        const text = document.getElementById('licenseOutput').innerText;
        window.open(`license.html?l=${encodeURIComponent(text)}`, '_blank');
    });

    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const licenseString = document.getElementById('licenseOutput').innerText;
            const projName = document.getElementById('projName').value || '[Project Name]';
            const projYear = document.getElementById('projYear').value || new Date().getFullYear();
            const projAuthor = document.getElementById('projAuthor').value || '[Author Name]';
            const projLink = document.getElementById('projLink').value || '';
            
            // Collect summaries
            const summaryItems = Array.from(document.querySelectorAll('#summaryList li')).map(li => li.innerText);
            
            let licenseText = `========================================================================\n`;
            licenseText += `LICENSE: ${licenseString}\n`;
            licenseText += `========================================================================\n\n`;
            licenseText += `Project: ${projName}\n`;
            licenseText += `Copyright (c) ${projYear} ${projAuthor}\n`;
            if (projLink) licenseText += `URL: ${projLink}\n`;
            licenseText += `\n`;
            licenseText += `This work is provided under the terms of the ${licenseString} license.\n`;
            licenseText += `The following terms apply:\n\n`;
            
            summaryItems.forEach(item => {
                licenseText += `  - ${item}\n`;
            });
            
            licenseText += `\n`;
            licenseText += `For full definitions of the ADAB modular license, visit:\n`;
            licenseText += `https://arvdevable.github.io/ADAB/license.html?l=${encodeURIComponent(licenseString)}\n`;
            licenseText += `========================================================================\n`;

            const blob = new Blob([licenseText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'LICENSE.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}

function updateLicense() {
    const inputs = document.querySelectorAll('input[type="radio"]:checked');
    let selectedCodes = [];
    
    inputs.forEach(input => {
        if (input.value) {
            selectedCodes.push(input.value);
        }
    });
    
    // Check contradictions
    let errors = [];
    contradictions.forEach(rule => {
        const hasAll = rule.codes.every(code => selectedCodes.includes(code));
        
        // Handle implicit default contradictions
        // E.g. if 'S' is selected, but Modification is unspecified (defaults to NM)
        if (!hasAll && rule.codes.includes('NM') && selectedCodes.includes('S')) {
            const modInput = document.querySelector('input[name="mod"]:checked');
            if (!modInput || modInput.value === '') {
                errors.push('Share-alike (S) requires Modification to be explicitly permitted (M). Default is NM.');
            }
        }
        
        if (!hasAll && rule.codes.includes('NM') && selectedCodes.includes('D')) {
            const modInput = document.querySelector('input[name="mod"]:checked');
            if (!modInput || modInput.value === '') {
                errors.push('Distribution of derivatives (D) requires Modification to be explicitly permitted (M). Default is NM.');
            }
        }
        
        if (hasAll) {
            errors.push(rule.message);
        }
    });
    
    // Check logical fallacies with defaults if not explicitly contradicted but still invalid
    // We did this above for S + NM (implicit), D + NM (implicit), D + NR (implicit)

    // Generate license string
    let singleLetters = [];
    let multiLetters = [];
    
    selectedCodes.forEach(code => {
        if (code.length === 1) {
            singleLetters.push(code);
        } else {
            multiLetters.push(code);
        }
    });
    
    // Sort single letters according to predefined order for nice output
    singleLetters.sort((a, b) => {
        const indexA = singleLetterOrder.indexOf(a) !== -1 ? singleLetterOrder.indexOf(a) : 99;
        const indexB = singleLetterOrder.indexOf(b) !== -1 ? singleLetterOrder.indexOf(b) : 99;
        return indexA - indexB;
    });
    
    let licenseParts = ['ADAB'];
    
    if (singleLetters.length > 0) {
        licenseParts.push(singleLetters.join(''));
    }
    
    if (multiLetters.length > 0) {
        // preserve order as selected or alphabetically, let's keep it as is
        licenseParts = licenseParts.concat(multiLetters);
    }
    
    const finalLicense = licenseParts.join('-');
    document.getElementById('licenseOutput').innerText = finalLicense;
    
    // Update validation UI
    const statusContainer = document.getElementById('validationStatus');
    const statusText = statusContainer.querySelector('.status-text');
    const errorContainer = document.getElementById('errorContainer');
    
    errorContainer.innerHTML = '';
    
    if (errors.length > 0) {
        statusContainer.classList.add('invalid');
        statusText.innerText = 'Invalid License Combination';
        
        errors.forEach(err => {
            const errDiv = document.createElement('div');
            errDiv.className = 'error-item';
            errDiv.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>${err}</span>
            `;
            errorContainer.appendChild(errDiv);
        });
    } else {
        statusContainer.classList.remove('invalid');
        statusText.innerText = 'Valid License';
    }
    
    // Update summary
    updateSummary(selectedCodes);
}

function updateSummary(selectedCodes) {
    const list = document.getElementById('summaryList');
    list.innerHTML = '';
    
    // Get all options that are active (including defaults if unspecified)
    let summaryItems = [];
    
    // Modification
    if (selectedCodes.includes('M')) {
        summaryItems.push('Modification is permitted.');
    } else {
        summaryItems.push('Modification is forbidden (Default NM).');
    }
    
    // Commercial
    if (selectedCodes.includes('C')) {
        summaryItems.push('Commercial use is permitted.');
    } else {
        summaryItems.push('Using SOURCE for non-commercial use only.');
    }
    
    // Redistribution
    if (selectedCodes.includes('R')) {
        summaryItems.push('Redistribution of the original, unmodified work is permitted.');
    } else {
        summaryItems.push('Redistribution of the original, unmodified work is prohibited (Default NR).');
    }
    
    // Derivatives
    if (selectedCodes.includes('D')) {
        summaryItems.push('Distribution of modified versions is permitted.');
    } else {
        summaryItems.push('No distribution of modified versions (Default ND).');
    }
    
    // Share-alike
    if (selectedCodes.includes('S')) {
        summaryItems.push('Share-alike is strictly required for derivatives.');
    } else if (selectedCodes.includes('NS')) {
        summaryItems.push('Share-alike is encouraged but not required.');
    }
    
    // Attribution
    if (selectedCodes.includes('A')) {
        summaryItems.push('Attribution to original creator is required.');
    }
    
    // Source
    if (selectedCodes.includes('SO')) {
        summaryItems.push('Source code/files must be made available.');
    }
    
    // AI Training
    if (selectedCodes.includes('T')) {
        summaryItems.push('AI training is explicitly permitted.');
    } else {
        summaryItems.push('AI training is forbidden (Default NT).');
    }
    
    // Revocability
    if (selectedCodes.includes('REV')) {
        summaryItems.push('License is REVOCABLE. It remains valid until the official revocation date or version change. Prior use is not retroactively affected.');
    } else {
        summaryItems.push('License is strictly irrevocable (Default IRR).');
    }
    
    // Public Domain
    if (selectedCodes.includes('P')) {
        summaryItems.push('Work is dedicated to the Public Domain.');
    }
    
    summaryItems.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        list.appendChild(li);
    });
}
