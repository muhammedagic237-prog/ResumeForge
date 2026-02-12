// ===== STATE =====
let currentTemplate = 'modern';
let skills = [];
let experienceEntries = [];
let educationEntries = [];
let languageEntries = [];
let isPremiumUnlocked = false;
let saveTimeout = null;

const PREMIUM_TEMPLATES = ['elegant', 'tech', 'compact', 'executive', 'bold', 'corporate', 'artistic', 'professional', 'academic', 'classic'];

// ===== NAVIGATION =====
function startBuilder(template) {
    if (template) {
        if (PREMIUM_TEMPLATES.includes(template) && !isPremiumUnlocked) {
            showPremiumModal();
            return;
        }
        currentTemplate = template;
        document.getElementById('template-select').value = template;
    }
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('builder-app').classList.remove('hidden');

    const hasSaved = localStorage.getItem('resumeforge_data');
    if (hasSaved) {
        loadFromStorage();
    } else {
        loadSampleData();
    }

    // Open all sections so fields are visible immediately
    openAllSections();
    updatePreview();
}

function openAllSections() {
    document.querySelectorAll('.section-toggle').forEach(t => t.classList.add('active'));
    document.querySelectorAll('.section-content').forEach(c => c.classList.add('open'));
}

function loadSampleData() {
    document.getElementById('fullName').value = 'Alex Johnson';
    document.getElementById('jobTitle').value = 'Senior Software Engineer';
    document.getElementById('email').value = 'alex.johnson@email.com';
    document.getElementById('phone').value = '+1 (555) 987-6543';
    document.getElementById('location').value = 'San Francisco, CA';
    document.getElementById('website').value = 'linkedin.com/in/alexjohnson';
    document.getElementById('summary').value = 'Results-driven software engineer with 6+ years of experience building scalable web applications. Passionate about clean code, team collaboration, and delivering exceptional user experiences. Proven track record of leading teams and shipping products used by millions.';

    experienceEntries = [
        { id: 1, role: 'Senior Software Engineer', company: 'Google', startDate: 'Jan 2022', endDate: 'Present', description: 'Led development of core search features serving 1B+ users.\nMentored a team of 5 junior engineers.\nImproved page load performance by 35%.' },
        { id: 2, role: 'Software Engineer', company: 'Meta', startDate: 'Jun 2019', endDate: 'Dec 2021', description: 'Built and maintained React components for the News Feed.\nCollaborated with design team to improve UI/UX.\nReduced bug count by 40% through automated testing.' }
    ];

    educationEntries = [
        { id: 3, degree: 'BSc Computer Science', school: 'Stanford University', startDate: '2015', endDate: '2019', description: 'GPA: 3.8/4.0 — Deans List' }
    ];

    skills = ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker', 'Agile'];

    languageEntries = [
        { id: 4, language: 'English', level: 'Native' },
        { id: 5, language: 'Spanish', level: 'Intermediate' }
    ];

    renderExperienceEntries();
    renderEducationEntries();
    renderSkills();
    renderLanguageEntries();
}

function goToLanding() {
    saveToStorage();
    document.getElementById('builder-app').classList.add('hidden');
    document.getElementById('landing-page').classList.remove('hidden');
}

function toggleMobileMenu() {
    const links = document.querySelector('.landing-nav-links');
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
}

// ===== SECTION TOGGLE =====
function toggleSection(el) {
    const isActive = el.classList.contains('active');
    // Toggle clicked section (allow multiple open)
    if (isActive) {
        el.classList.remove('active');
        el.nextElementSibling.classList.remove('open');
    } else {
        el.classList.add('active');
        el.nextElementSibling.classList.add('open');
    }
}

// ===== TEMPLATE SWITCHING =====
function changeTemplate(val) {
    if (PREMIUM_TEMPLATES.includes(val) && !isPremiumUnlocked) {
        showPremiumModal();
        document.getElementById('template-select').value = currentTemplate;
        return;
    }
    currentTemplate = val;
    updatePreview();
    triggerSave();
}

// ===== EXPERIENCE =====
function addExperience() {
    const id = Date.now();
    experienceEntries.push({ id, role: '', company: '', startDate: '', endDate: '', description: '' });
    renderExperienceEntries();
    updatePreview();
}

function removeExperience(id) {
    experienceEntries = experienceEntries.filter(e => e.id !== id);
    renderExperienceEntries();
    updatePreview();
    triggerSave();
}

function renderExperienceEntries() {
    const container = document.getElementById('experience-entries');
    container.innerHTML = experienceEntries.map(e => `
        <div class="entry-card" data-id="${e.id}">
            <button class="entry-remove" onclick="removeExperience(${e.id})" title="Remove">×</button>
            <div class="form-row">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" value="${esc(e.role)}" placeholder="Software Engineer" oninput="updateExpField(${e.id},'role',this.value)">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" value="${esc(e.company)}" placeholder="Google Inc." oninput="updateExpField(${e.id},'company',this.value)">
                </div>
            </div>
            <div class="form-row two-col">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="text" value="${esc(e.startDate)}" placeholder="Jan 2022" oninput="updateExpField(${e.id},'startDate',this.value)">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="text" value="${esc(e.endDate)}" placeholder="Present" oninput="updateExpField(${e.id},'endDate',this.value)">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Description</label>
                    <textarea rows="3" placeholder="Describe your responsibilities and achievements..." oninput="updateExpField(${e.id},'description',this.value)">${esc(e.description)}</textarea>
                </div>
            </div>
        </div>
    `).join('');
}

function updateExpField(id, field, value) {
    const entry = experienceEntries.find(e => e.id === id);
    if (entry) entry[field] = value;
    updatePreview();
    triggerSave();
}

// ===== EDUCATION =====
function addEducation() {
    const id = Date.now();
    educationEntries.push({ id, degree: '', school: '', startDate: '', endDate: '', description: '' });
    renderEducationEntries();
    updatePreview();
}

function removeEducation(id) {
    educationEntries = educationEntries.filter(e => e.id !== id);
    renderEducationEntries();
    updatePreview();
    triggerSave();
}

function renderEducationEntries() {
    const container = document.getElementById('education-entries');
    container.innerHTML = educationEntries.map(e => `
        <div class="entry-card" data-id="${e.id}">
            <button class="entry-remove" onclick="removeEducation(${e.id})" title="Remove">×</button>
            <div class="form-row">
                <div class="form-group">
                    <label>Degree / Certificate</label>
                    <input type="text" value="${esc(e.degree)}" placeholder="BSc Computer Science" oninput="updateEduField(${e.id},'degree',this.value)">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>School / University</label>
                    <input type="text" value="${esc(e.school)}" placeholder="MIT" oninput="updateEduField(${e.id},'school',this.value)">
                </div>
            </div>
            <div class="form-row two-col">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="text" value="${esc(e.startDate)}" placeholder="2018" oninput="updateEduField(${e.id},'startDate',this.value)">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="text" value="${esc(e.endDate)}" placeholder="2022" oninput="updateEduField(${e.id},'endDate',this.value)">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Description (optional)</label>
                    <textarea rows="2" placeholder="GPA, honors, relevant coursework..." oninput="updateEduField(${e.id},'description',this.value)">${esc(e.description)}</textarea>
                </div>
            </div>
        </div>
    `).join('');
}

function updateEduField(id, field, value) {
    const entry = educationEntries.find(e => e.id === id);
    if (entry) entry[field] = value;
    updatePreview();
    triggerSave();
}

// ===== LANGUAGES =====
function addLanguage() {
    const id = Date.now();
    languageEntries.push({ id, language: '', level: 'Native' });
    renderLanguageEntries();
    updatePreview();
}

function removeLanguage(id) {
    languageEntries = languageEntries.filter(e => e.id !== id);
    renderLanguageEntries();
    updatePreview();
    triggerSave();
}

function renderLanguageEntries() {
    const container = document.getElementById('language-entries');
    container.innerHTML = languageEntries.map(e => `
        <div class="entry-card" data-id="${e.id}">
            <button class="entry-remove" onclick="removeLanguage(${e.id})" title="Remove">×</button>
            <div class="form-row two-col">
                <div class="form-group">
                    <label>Language</label>
                    <input type="text" value="${esc(e.language)}" placeholder="English" oninput="updateLangField(${e.id},'language',this.value)">
                </div>
                <div class="form-group">
                    <label>Proficiency</label>
                    <select onchange="updateLangField(${e.id},'level',this.value)">
                        ${['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].map(l => `<option value="${l}" ${e.level === l ? 'selected' : ''}>${l}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

function updateLangField(id, field, value) {
    const entry = languageEntries.find(e => e.id === id);
    if (entry) entry[field] = value;
    updatePreview();
    triggerSave();
}

// ===== SKILLS =====
function handleSkillInput(event) {
    if (event.key === 'Enter' && event.target.value.trim()) {
        event.preventDefault();
        const skill = event.target.value.trim();
        if (!skills.includes(skill)) {
            skills.push(skill);
            renderSkills();
            updatePreview();
            triggerSave();
        }
        event.target.value = '';
    }
}

function removeSkill(index) {
    skills.splice(index, 1);
    renderSkills();
    updatePreview();
    triggerSave();
}

function renderSkills() {
    const container = document.getElementById('skills-tags');
    container.innerHTML = skills.map((s, i) => `
        <span class="skill-tag">${esc(s)}<button onclick="removeSkill(${i})">×</button></span>
    `).join('');
}

// ===== LIVE PREVIEW =====
function updatePreview() {
    const data = getFormData();
    const accentColor = document.getElementById('accentColor').value;
    const fontBody = document.getElementById('fontBody').value;
    const preview = document.getElementById('resume-preview');

    // Apply key customization variables
    preview.style.setProperty('--tpl-accent', accentColor);
    preview.style.fontFamily = fontBody;

    // Some templates use the accent color directly in CSS that we need to override or map
    // We'll rely on our specific template CSS, but we can also inject a dynamic style if needed
    // For this implementation, we will apply the font and let CSS variables handle colors where possible
    // However, since our CSS uses specific hex codes, we might need to inject inline styles or 
    // update the specific elements.
    // A better approach for this customized version is to set the specific elements' colors in JS
    // OR update the CSS to use var(--tpl-accent). 
    // Given the current CSS structure, we'll traverse and update common elements for the active preview.

    preview.className = `resume-page template-${currentTemplate}`;

    if (currentTemplate === 'creative' || currentTemplate === 'compact') {
        preview.innerHTML = renderCreativeTemplate(data);
    } else if (currentTemplate === 'classic') {
        preview.innerHTML = renderClassicTemplate(data);
    } else {
        preview.innerHTML = renderStandardTemplate(data);
    }

    // Apply dynamic colors after rendering
    applyDynamicColors(preview, accentColor);

    // Update color value display
    const colorDisplay = document.querySelector('.color-value');
    if (colorDisplay) colorDisplay.textContent = accentColor;

    triggerSave();
}

function getFormData() {
    return {
        fullName: val('fullName') || 'Your Name',
        jobTitle: val('jobTitle') || 'Professional Title',
        email: val('email'),
        phone: val('phone'),
        location: val('location'),
        website: val('website'),
        summary: val('summary'),
        experience: experienceEntries.filter(e => e.role || e.company),
        education: educationEntries.filter(e => e.degree || e.school),
        skills: skills,
        languages: languageEntries.filter(e => e.language)
    };
}

function val(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function esc(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderContactItems(data) {
    const items = [];
    if (data.email) items.push(`📧 ${esc(data.email)}`);
    if (data.phone) items.push(`📱 ${esc(data.phone)}`);
    if (data.location) items.push(`📍 ${esc(data.location)}`);
    if (data.website) items.push(`🔗 ${esc(data.website)}`);
    return items.map(i => `<span>${i}</span>`).join('');
}

function renderExperienceSection(data) {
    if (!data.experience.length) return '';
    return `
        <div class="resume-tpl-section">
            <div class="resume-tpl-section-title">Work Experience</div>
            ${data.experience.map(e => `
                <div class="resume-tpl-entry">
                    <div class="resume-tpl-entry-header">
                        <span class="resume-tpl-entry-role">${esc(e.role) || 'Position'}</span>
                        <span class="resume-tpl-entry-date">${esc(e.startDate)}${e.endDate ? ' — ' + esc(e.endDate) : ''}</span>
                    </div>
                    <div class="resume-tpl-entry-company">${esc(e.company)}</div>
                    ${e.description ? `<div class="resume-tpl-entry-desc">${esc(e.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `).join('')}
        </div>`;
}

function renderEducationSection(data) {
    if (!data.education.length) return '';
    return `
        <div class="resume-tpl-section">
            <div class="resume-tpl-section-title">Education</div>
            ${data.education.map(e => `
                <div class="resume-tpl-entry">
                    <div class="resume-tpl-entry-header">
                        <span class="resume-tpl-entry-role">${esc(e.degree) || 'Degree'}</span>
                        <span class="resume-tpl-entry-date">${esc(e.startDate)}${e.endDate ? ' — ' + esc(e.endDate) : ''}</span>
                    </div>
                    <div class="resume-tpl-entry-company">${esc(e.school)}</div>
                    ${e.description ? `<div class="resume-tpl-entry-desc">${esc(e.description)}</div>` : ''}
                </div>
            `).join('')}
        </div>`;
}

function renderSkillsSection(data) {
    if (!data.skills.length) return '';
    return `
        <div class="resume-tpl-section">
            <div class="resume-tpl-section-title">Skills</div>
            <div class="resume-tpl-skills">
                ${data.skills.map(s => `<span class="resume-tpl-skill">${esc(s)}</span>`).join('')}
            </div>
        </div>`;
}

function renderLanguagesSection(data) {
    if (!data.languages.length) return '';
    return `
        <div class="resume-tpl-section">
            <div class="resume-tpl-section-title">Languages</div>
            <div class="resume-tpl-languages">
                ${data.languages.map(l => `
                    <span class="resume-tpl-lang">${esc(l.language)} <span class="resume-tpl-lang-level">• ${esc(l.level)}</span></span>
                `).join('')}
            </div>
        </div>`;
}

function renderStandardTemplate(data) {
    return `
        <div class="resume-tpl-header">
            <div class="resume-tpl-name">${esc(data.fullName)}</div>
            <div class="resume-tpl-title">${esc(data.jobTitle)}</div>
            <div class="resume-tpl-contact">${renderContactItems(data)}</div>
        </div>
        <div class="resume-tpl-body">
            ${data.summary ? `<div class="resume-tpl-section"><div class="resume-tpl-section-title">Professional Summary</div><div class="resume-tpl-summary">${esc(data.summary).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${renderExperienceSection(data)}
            ${renderEducationSection(data)}
            ${renderSkillsSection(data)}
            ${renderLanguagesSection(data)}
        </div>`;
}

function renderCreativeTemplate(data) {
    return `
        <div class="resume-tpl-sidebar">
            <div class="resume-tpl-name">${esc(data.fullName)}</div>
            <div class="resume-tpl-title">${esc(data.jobTitle)}</div>
            <div class="resume-tpl-contact">${renderContactItems(data)}</div>
            ${renderSkillsSection(data)}
            ${renderLanguagesSection(data)}
        </div>
        </div>
        <div class="resume-tpl-main">
            ${data.summary ? `<div class="resume-tpl-section"><div class="resume-tpl-section-title">About Me</div><div class="resume-tpl-summary">${esc(data.summary).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${renderExperienceSection(data)}
            ${renderEducationSection(data)}
        </div>`;
}

function renderClassicTemplate(data) {
    return `
        <div class="resume-tpl-container">
            <div class="resume-tpl-header">
                <div class="resume-tpl-name">${esc(data.fullName)}</div>
                <div class="resume-tpl-title">${esc(data.jobTitle)}</div>
                <div class="resume-tpl-contact">${renderContactItems(data)}</div>
            </div>
            <div class="resume-tpl-body">
                ${data.summary ? `<div class="resume-tpl-section"><div class="resume-tpl-section-title">Summary</div><div class="resume-tpl-summary">${esc(data.summary).replace(/\n/g, '<br>')}</div></div>` : ''}
                ${renderExperienceSection(data)}
                ${renderEducationSection(data)}
                ${renderSkillsSection(data)}
                ${renderLanguagesSection(data)}
            </div>
        </div>`;
}

function applyDynamicColors(container, color) {
    // Dynamic color application helper
    // Validates if color is valid hex
    if (!/^#[0-9A-F]{6}$/i.test(color)) return;

    // Headings
    container.querySelectorAll('.resume-tpl-name, .resume-tpl-section-title, .resume-tpl-entry-company').forEach(el => {
        // Only override if the template is meant to change with accent
        // For standard/modern templates, yes.
        // For some strict themes, maybe we want to keep them fixed?
        // User requested "all of the templates be editable".
        el.style.color = color;
        el.style.borderColor = color;
    });

    // Backgrounds for badges/headers? 
    // This is tricky as some use gradients. We'll stick to text elements validation for now.
    // For fully custom backgrounds, we'd need more logic. 
    // Let's at least update the skills badges
    container.querySelectorAll('.resume-tpl-skill').forEach(el => {
        el.style.borderColor = color;
        el.style.color = color;
        // make bg transparent version of color
        // simplistic approach: 
        el.style.backgroundColor = color + '15'; // 10% opacity
    });

    // Sidebar backgrounds for compact/creative
    container.querySelectorAll('.resume-tpl-sidebar, .resume-tpl-header').forEach(el => {
        // Check if it has a background color set in CSS that isn't white
        const style = window.getComputedStyle(el);
        if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'rgb(255, 255, 255)') {
            el.style.background = color;
            // If background is dark, ensure text is white
            // This is a naive check, but fine for this MVP
            el.style.color = '#fff';
        }
    });
}

// ===== PDF EXPORT =====
function downloadPDF() {
    const element = document.getElementById('resume-preview');
    const resumeName = document.getElementById('resume-name').value || 'My Resume';

    showToast('📄', 'Generating PDF...');

    const opt = {
        margin: 0,
        filename: `${resumeName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        showToast('✅', 'PDF downloaded successfully!');
    }).catch(() => {
        showToast('❌', 'PDF generation failed. Please try again.');
    });
}

// ===== STORAGE =====
function triggerSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveToStorage();
        showSaveIndicator();
    }, 500);
}

function saveToStorage() {
    const data = {
        template: currentTemplate,
        resumeName: document.getElementById('resume-name')?.value || 'My Resume',
        fullName: val('fullName'),
        jobTitle: val('jobTitle'),
        email: val('email'),
        phone: val('phone'),
        location: val('location'),
        website: val('website'),
        summary: val('summary'),
        experience: experienceEntries,
        education: educationEntries,
        skills: skills,
        languages: languageEntries,
        skills: skills,
        languages: languageEntries,
        isPremiumUnlocked: isPremiumUnlocked,
        accentColor: document.getElementById('accentColor')?.value,
        fontBody: document.getElementById('fontBody')?.value
    };
    try {
        localStorage.setItem('resumeforge_data', JSON.stringify(data));
    } catch (e) { /* storage full */ }
}

function loadFromStorage() {
    try {
        const raw = localStorage.getItem('resumeforge_data');
        if (!raw) return;
        const data = JSON.parse(raw);

        currentTemplate = data.template || 'modern';
        document.getElementById('template-select').value = currentTemplate;
        if (data.resumeName) document.getElementById('resume-name').value = data.resumeName;

        setVal('fullName', data.fullName);
        setVal('jobTitle', data.jobTitle);
        setVal('email', data.email);
        setVal('phone', data.phone);
        setVal('location', data.location);
        setVal('website', data.website);
        setVal('location', data.location);
        setVal('website', data.website);
        setVal('summary', data.summary);

        if (data.accentColor) setVal('accentColor', data.accentColor);
        if (data.fontBody) setVal('fontBody', data.fontBody);

        experienceEntries = data.experience || [];
        educationEntries = data.education || [];
        skills = data.skills || [];
        languageEntries = data.languages || [];
        isPremiumUnlocked = data.isPremiumUnlocked || false;

        renderExperienceEntries();
        renderEducationEntries();
        renderSkills();
        renderLanguageEntries();
        openAllSections();
    } catch (e) { /* corrupt data */ }
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.value = value;
}

function showSaveIndicator() {
    const indicator = document.getElementById('save-indicator');
    indicator.classList.add('visible');
    setTimeout(() => indicator.classList.remove('visible'), 2000);
}

// ===== PREMIUM MODAL =====
function showPremiumModal() {
    document.getElementById('premium-modal').classList.add('active');
}

function closePremiumModal() {
    document.getElementById('premium-modal').classList.remove('active');
}

function unlockPremium() {
    // In production, this would connect to Stripe/payment
    isPremiumUnlocked = true;
    closePremiumModal();
    showToast('⭐', 'Premium templates unlocked!');
    triggerSave();
}

// ===== TOAST =====
function showToast(icon, message) {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-icon').textContent = icon;
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
}

// ===== LANDING PAGE ANIMATIONS =====
function animateCounters() {
    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .template-preview-card, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
    initScrollAnimations();

    // Close modal on overlay click
    document.getElementById('premium-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closePremiumModal();
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePremiumModal();
    });
});
