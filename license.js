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
    const dateStr = urlParams.get('date');
    if (dateStr) {
        const dateElement = document.createElement('p');
        dateElement.style.marginTop = '0.75rem';
        dateElement.style.fontSize = '1.05rem';
        dateElement.style.color = 'var(--text-secondary)';
        dateElement.textContent = `Effective Date: `;
        const strong = document.createElement('strong');
        strong.style.color = 'var(--text-primary)';
        strong.style.fontFamily = 'var(--font-mono)';
        strong.textContent = dateStr;
        dateElement.appendChild(strong);
        licenseHeader.appendChild(dateElement);
    }
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
        terms.push({
            title: 'Modification (M)',
            desc: 'The Licensor grants the Licensee a worldwide, royalty-free, non-exclusive, and non-sublicensable right to adapt, translate, modify, remix, transform, or build upon the Work. Any such modified versions, adaptations, or derivative works created by the Licensee are subject to the terms of this license, including conditions for their distribution (such as Share-Alike or Derivative Distribution, if applicable).',
            tldr: 'Modification is permitted. You may alter, transform, or build upon the material.'
        });
    } else {
        terms.push({
            title: 'No Modification (NM)',
            desc: 'The Licensor strictly prohibits the Licensee from adapting, translating, modifying, remixing, transforming, or otherwise altering the Work in any form or medium. The Work must be preserved and used exactly as originally published by the Licensor. The creation of derivative works, adaptations, or remixes is a direct violation of this license.',
            tldr: 'Modification is forbidden. You may not alter, transform, or build upon the material.'
        });
    }
    
    // Commercial
    if (selectedCodes.includes('C')) {
        terms.push({
            title: 'Commercial Use (C)',
            desc: 'The Licensor grants the Licensee the right to use, copy, distribute, perform, display, and modify (if permitted) the Work, as well as any derivative works, for commercial purposes. This includes any use primarily intended for or directed toward commercial advantage, business activities, or private monetary compensation.',
            tldr: 'Commercial use is permitted. You may use the material for commercial purposes.'
        });
    } else {
        terms.push({
            title: 'Using SOURCE for non-commercial use only (NC)',
            desc: 'The Licensor restricts the use, reproduction, distribution, and modification (if permitted) of the Work and its corresponding source files/material strictly to non-commercial purposes. Commercial exploitation of the Work—including any use primarily intended for, directed toward, or resulting in commercial advantage, business operations, or private monetary compensation—is strictly prohibited without prior written authorization from the Licensor.',
            tldr: 'Using SOURCE for non-commercial use only.'
        });
    }
    
    // Redistribution
    if (selectedCodes.includes('R')) {
        terms.push({
            title: 'Redistribution of original work is permitted (R)',
            desc: 'The Licensor grants the Licensee permission to redistribute, copy, publish, host, mirror, or publicly transmit the original, unmodified Work in its entirety. Any redistribution must retain all copyright notices, license references, and attribution details as originally provided.',
            tldr: 'Redistribution of the original, unmodified work is permitted. You may share the exact original work.'
        });
    } else {
        terms.push({
            title: 'Redistribution of original work is prohibited (NR)',
            desc: 'The Licensor strictly prohibits the Licensee from redistributing, sub-licensing, re-uploading, mirroring, or public hosting of the original, unmodified Work. Recipients of the Work must obtain it directly from the original source or official channels specified by the Licensor.',
            tldr: 'Redistribution of the original, unmodified work is prohibited. You may not re-upload or share the original work.'
        });
    }
    
    // Derivatives
    if (selectedCodes.includes('D')) {
        terms.push({
            title: 'Distribution of modified versions is permitted (D)',
            desc: 'The Licensor permits the Licensee to distribute, share, publish, or make available modified versions, adaptations, or derivative works based on the Work, provided they comply with all other applicable terms of this license (such as Share-Alike, if required).',
            tldr: 'Distribution of modified versions is permitted. You may share your modified versions of the work.'
        });
    } else {
        terms.push({
            title: 'Distribution of modified versions is prohibited (ND)',
            desc: 'The Licensor strictly prohibits the Licensee from distributing, sharing, publishing, or otherwise making available any modified versions, adaptations, or derivative works based on the Work. Any modified versions created by the Licensee must be kept strictly for personal or private use.',
            tldr: 'Distribution of modified versions is prohibited. You may not share any modified versions.'
        });
    }
    
    // Share-alike
    if (selectedCodes.includes('S')) {
        terms.push({
            title: 'Share-Alike Required (S)',
            desc: 'If the Licensee modifies the Work and distributes the resulting derivative work, they are strictly required to license the entire derivative work under the exact same ADAB license terms as the original Work. No additional restrictions or terms may be imposed on the derivative work.',
            tldr: 'If you distribute modified versions, you must distribute your contributions under the same license as the original.'
        });
    } else if (selectedCodes.includes('NS')) {
        terms.push({
            title: 'Share-Alike Encouraged (NS)',
            desc: 'The Licensor does not legally obligate the Licensee to use the same license for derivative works, but highly encourages and recommends distributing any modified versions under the same ADAB license terms to support a shared, open ecosystem.',
            tldr: 'It is encouraged, but not required, to distribute your contributions under the same license.'
        });
    }
    
    // Attribution
    if (selectedCodes.includes('A')) {
        terms.push({
            title: 'Attribution Required (A)',
            desc: 'The Licensee must provide clear, prominent, and appropriate attribution to the original creator(s) of the Work. This includes retaining all copyright notices, providing a link to the original project/source, citing the license name, and clearly indicating if any modifications were made to the Work in a reasonable manner.',
            tldr: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made.'
        });
    }
    
    // Source
    if (selectedCodes.includes('SO')) {
        terms.push({
            title: 'Source Required (SO)',
            desc: 'Any distribution of the Work or derivative works thereof must be accompanied by, or provide a clear, public, and free path to download, the complete and corresponding machine-readable source code, original design assets, or project files.',
            tldr: 'Source code or original source files must be made available to anyone who receives the work.'
        });
    }
    
    // AI Training
    if (selectedCodes.includes('T')) {
        terms.push({
            title: 'AI Training Permitted (T)',
            desc: 'The Licensor explicitly grants permission to use the Work, its contents, and any associated data for the purpose of training, fine-tuning, testing, or validating artificial intelligence models, machine learning systems, neural networks, or automated content generation technologies.',
            tldr: 'The work may be used to train artificial intelligence models.'
        });
    } else {
        terms.push({
            title: 'No AI Training (NT)',
            desc: 'The Licensor strictly prohibits the use of the Work, its contents, or any associated data for training, fine-tuning, testing, or validating artificial intelligence models, machine learning systems, large language models, neural networks, or automated content generation technologies.',
            tldr: 'The work may not be used to train artificial intelligence models.'
        });
    }
    
    // Revocability
    if (selectedCodes.includes('REV')) {
        terms.push({
            title: 'Revocable (REV)',
            desc: 'The Licensor reserves the right to revoke or modify the terms of this license at any time. Any revocation or modification will apply prospectively and will not retroactively invalidate permissions for copies of the Work obtained and used prior to the date of revocation.',
            tldr: 'This license remains valid until the official revocation date or version change. Prior use before that date is not retroactively affected.'
        });
    } else {
        terms.push({
            title: 'Irrevocable (IRR)',
            desc: 'The grants, permissions, and licenses extended under this agreement are strictly irrevocable. Once granted, the Licensor cannot terminate, revoke, or alter these permissions for any Licensee who complies with the terms of this license.',
            tldr: 'This license is strictly irrevocable.'
        });
    }
    
    // Public Domain
    if (selectedCodes.includes('P')) {
        terms.push({
            title: 'Public Domain (P)',
            desc: 'The Licensor waives all copyright and related or neighboring rights to the Work to the fullest extent permitted by law, dedicating it to the public domain. The Work may be freely used, modified, and shared by anyone for any purpose without restriction.',
            tldr: 'This work is dedicated to the Public Domain.'
        });
    }

    let html = `
        <div class="definitions-container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="margin: 0; color: var(--text-primary);">License Agreement</h2>
                <a href="#tldr-section" class="tldr-link">Jump to TL;DR Summary ↓</a>
            </div>

            <section class="license-section">
                <h3>1. General Definitions</h3>
                <ul class="term-list">
                    <li class="term-item">
                        <div class="term-icon">/</div>
                        <div class="term-content">
                            <span class="term-title">The Work</span>
                            <span class="term-desc">Work means the copyrighted material to which this license is attached, including any associated source files, assets, documentation, or other materials provided by the Licensor.</span>
                        </div>
                    </li>
                    <li class="term-item">
                        <div class="term-icon">/</div>
                        <div class="term-content">
                            <span class="term-title">Licensor</span>
                            <span class="term-desc">Licensor means the individual or entity that owns the copyright to the Work and grants the rights under this license.</span>
                        </div>
                    </li>
                    <li class="term-item">
                        <div class="term-icon">/</div>
                        <div class="term-content">
                            <span class="term-title">Licensee</span>
                            <span class="term-desc">Licensee (or "You") means the individual or entity exercising the permissions granted under this license.</span>
                        </div>
                    </li>
                    <li class="term-item">
                        <div class="term-icon">/</div>
                        <div class="term-content">
                            <span class="term-title">Commercial Use</span>
                            <span class="term-desc">Commercial use means any use of the Work primarily intended for, directed toward, or resulting in commercial advantage, business operations, or monetary compensation. This includes, but is not limited to, selling, licensing, monetizing, incorporating into commercial products or services, or otherwise exploiting the Work for financial gain.<br><br>The following activities, by themselves, do not constitute commercial use of the Work: discussion, criticism, commentary, review, news reporting, education, research, demonstration, or merely displaying or featuring the Work in another creation, provided the Work itself is not being sold, licensed, or otherwise commercially exploited.</span>
                        </div>
                    </li>
                    <li class="term-item">
                        <div class="term-icon">/</div>
                        <div class="term-content">
                            <span class="term-title">Derivatives / Modified Versions</span>
                            <span class="term-desc">Derivatives or Modified Versions means any work that is based upon, derived from, or incorporates the Work, such as a translation, adaptation, arrangement, or modification.</span>
                        </div>
                    </li>
                    <li class="term-item">
                        <div class="term-icon">/</div>
                        <div class="term-content">
                            <span class="term-title">Source Code / Source Files</span>
                            <span class="term-desc">Source Code or Source Files means the preferred form of the Work for making modifications, including but not limited to software source code, design files, documentation sources, and media asset files.</span>
                        </div>
                    </li>
                </ul>
            </section>

            <section class="license-section" style="margin-top: 2.5rem;">
                <h3>2. License Terms & Conditions</h3>
                <ul class="term-list">
    `;
    
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
    
    html += `
                </ul>
            </section>

            <section class="license-section" id="tldr-section" style="margin-top: 3rem; border-top: 1px solid var(--border-color); padding-top: 2rem;">
                <h3 style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                    <span>3. TL;DR Summary</span>
                    <span style="font-size: 0.85rem; font-weight: normal; color: var(--text-secondary); text-transform: none;">(A quick, non-legal overview of terms)</span>
                </h3>
                <ul class="summary-list" style="margin-top: 1rem; list-style: none; display: flex; flex-direction: column; gap: 0.75rem;">
    `;

    terms.forEach(term => {
        html += `
            <li style="display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.95rem; color: #e2e2e8;">
                <span style="color: var(--accent-secondary); font-weight: bold;">=</span>
                <div>
                    <strong style="color: var(--text-primary);">${term.title.split(' (')[0]}:</strong>
                    <span>${term.tldr}</span>
                </div>
            </li>
        `;
    });

    html += `
                </ul>
            </section>
        </div>
    `;
    
    contentArea.innerHTML = html;
}
