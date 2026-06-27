// license.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const licenseString = urlParams.get('l');
    
    const contentArea = document.getElementById('contentArea');
    const licenseHeader = document.getElementById('licenseHeader');
    const displayLicense = document.getElementById('displayLicense');

    if (!licenseString || !licenseString.startsWith('ADAB')) {
        contentArea.innerHTML = `
            <div class="not-found">
                <h3>Invalid or missing license</h3>
                <p>Please provide a valid ADAB license string in the URL (e.g., ?l=ADAB-MACD-NR-NT).</p>
            </div>
        `;
        return;
    }

    // Display header
    displayLicense.innerText = licenseString;
    licenseHeader.style.display = 'block';

    // Parse license
    const parts = licenseString.split('-');
    // Remove "ADAB"
    parts.shift();
    
    let codes = [];
    parts.forEach((part, index) => {
        if (index === 0 && !part.match(/^(NM|NC|NS|ND|NR|NT|SO|REV|IRR)$/)) {
            // First part might be grouped single letters if it doesn't strictly match a multi-letter keyword
            // Example: MACD, MS, M
            // Let's check if it consists only of single-letter codes: M, A, C, S, D, R, T, P
            const singleLetterMatches = part.match(/^[MACSDTRP]+$/);
            if (singleLetterMatches) {
                codes = codes.concat(part.split(''));
            } else {
                codes.push(part);
            }
        } else {
            codes.push(part);
        }
    });

    renderTerms(codes);
});

function renderTerms(selectedCodes) {
    const contentArea = document.getElementById('contentArea');
    
    // Using the same logic as the builder
    const terms = [];

    // Modification
    if (selectedCodes.includes('M')) {
        terms.push({ title: 'Modification (M)', desc: 'Modification is permitted. You may alter, transform, or build upon the material.' });
    } else {
        terms.push({ title: 'No Modification (NM)', desc: 'Modification is forbidden. You may not alter, transform, or build upon the material.' });
    }
    
    // Commercial
    if (selectedCodes.includes('C')) {
        terms.push({ title: 'Commercial Use (C)', desc: 'Commercial use is permitted. You may use the material for commercial purposes.' });
    } else {
        terms.push({ title: 'Non-Commercial (NC)', desc: 'Commercial use is prohibited. You may not use the material for commercial purposes.' });
    }
    
    // Redistribution
    if (selectedCodes.includes('R')) {
        terms.push({ title: 'Redistribution (R)', desc: 'Redistribution of the original, unmodified work is permitted. You may share the exact original work.' });
    } else {
        terms.push({ title: 'No Redistribution (NR)', desc: 'Redistribution of the original, unmodified work is prohibited. You may not re-upload or share the original work.' });
    }
    
    // Derivatives
    if (selectedCodes.includes('D')) {
        terms.push({ title: 'Derivative Distribution (D)', desc: 'Distribution of modified versions is permitted. You may share your modified versions of the work.' });
    } else {
        terms.push({ title: 'No Derivative Distribution (ND)', desc: 'Distribution of modified versions is prohibited. You may not share any modified versions.' });
    }
    
    // Share-alike
    if (selectedCodes.includes('S')) {
        terms.push({ title: 'Share-Alike Required (S)', desc: 'If you distribute modified versions, you must distribute your contributions under the same license as the original.' });
    } else if (selectedCodes.includes('NS')) {
        terms.push({ title: 'Share-Alike Encouraged (NS)', desc: 'It is encouraged, but not required, to distribute your contributions under the same license.' });
    }
    
    // Attribution
    if (selectedCodes.includes('A')) {
        terms.push({ title: 'Attribution Required (A)', desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made.' });
    }
    
    // Source
    if (selectedCodes.includes('SO')) {
        terms.push({ title: 'Source Required (SO)', desc: 'Source code or original source files must be made available to anyone who receives the work.' });
    }
    
    // AI Training
    if (selectedCodes.includes('T')) {
        terms.push({ title: 'AI Training Permitted (T)', desc: 'The work may be used to train artificial intelligence models.' });
    } else {
        terms.push({ title: 'No AI Training (NT)', desc: 'The work may not be used to train artificial intelligence models.' });
    }
    
    // Revocability
    if (selectedCodes.includes('REV')) {
        terms.push({ title: 'Revocable (REV)', desc: 'This license remains valid until the official revocation date or version change. Prior use before that date is not retroactively affected.' });
    } else {
        terms.push({ title: 'Irrevocable (IRR)', desc: 'This license is strictly irrevocable.' });
    }
    
    // Public Domain
    if (selectedCodes.includes('P')) {
        terms.push({ title: 'Public Domain (P)', desc: 'This work is dedicated to the Public Domain.' });
    }

    let html = `<h2>License Terms</h2><ul class="term-list">`;
    
    terms.forEach(term => {
        html += `
            <li class="term-item">
                <div class="term-icon">/</div>
                <div class="term-content">
                    <span class="term-title">${term.title}</span>
                    <span class="term-desc">${term.desc}</span>
                </div>
            </li>
        `;
    });
    
    html += `</ul>`;
    contentArea.innerHTML = html;
}
