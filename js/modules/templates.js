// Templates Management

const TemplatesManager = {
    
    // Modal Operations
    
    showTemplates() {
        const templatesContainer = document.getElementById('templatesContainer');
        const templatesModal = document.getElementById('templatesModal');
        
        if (!templatesContainer || !templatesModal) return;
        
        templatesContainer.innerHTML = '';
        
        noteTemplates.forEach(template => {
            const templateDiv = document.createElement('div');
            templateDiv.style.cssText = `
                border: 1px solid #444;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.2s;
                background: var(--bg-panel-light);
            `;
            
            templateDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <h4 style="margin: 0; color: white;">${template.title}</h4>
                </div>
                <p style="margin: 0; font-size: 12px; color: #ccc; line-height: 1.4;">
                    ${template.template.split('\n').slice(0, 3).join(' ').substring(0, 100)}...
                </p>
            `;
            
            templateDiv.addEventListener('click', () => this.useTemplate(template));
            templateDiv.addEventListener('mouseenter', () => {
                templateDiv.style.background = 'var(--bg-card)';
                templateDiv.style.borderColor = 'var(--primary)';
            });
            templateDiv.addEventListener('mouseleave', () => {
                templateDiv.style.background = 'var(--bg-panel-light)';
                templateDiv.style.borderColor = '#444';
            });
            
            templatesContainer.appendChild(templateDiv);
        });
        
        UIManager.showModal(templatesModal);
    },
    
    useTemplate(template) {
        this.closeTemplatesModal();
        window.useTemplateHandler(template);
    },
    
    closeTemplatesModal() {
        const templatesModal = document.getElementById('templatesModal');
        UIManager.hideModal(templatesModal);
    },
    
    // Template Utilities
    
    getTemplateById(templateId) {
        return noteTemplates.find(template => template.id === templateId) || null;
    },
    
    getTemplateCategories() {
        const categories = new Set();
        noteTemplates.forEach(template => {
            const tags = NotesManager.extractTags(template.template);
            tags.forEach(tag => categories.add(tag));
        });
        return Array.from(categories).sort();
    },
    
    getTemplatesByCategory(category) {
        return noteTemplates.filter(template => {
            const tags = NotesManager.extractTags(template.template);
            return tags.includes(category.toLowerCase());
        });
    },
    
    searchTemplates(query) {
        if (!query) return noteTemplates;
        
        const searchTerm = query.toLowerCase();
        return noteTemplates.filter(template => {
            return template.title.toLowerCase().includes(searchTerm) ||
                   template.template.toLowerCase().includes(searchTerm);
        });
    }
};