// Tags Management

const TagsManager = {
    
    // Modal Operations
    
    showTagsModal(notes, currentFilter) {
        const tagsContainer = document.getElementById('tagsContainer');
        const tagsModal = document.getElementById('tagsModal');
        
        if (!tagsContainer || !tagsModal) return;
        
        tagsContainer.innerHTML = '';
        
        // Get all unique tags from notes
        const allTags = NotesManager.getAllTags(notes);
        
        if (allTags.length === 0) {
            tagsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <h4>No tags found</h4>
                    <p>Add hashtags like #work #personal to your notes to organize them!</p>
                </div>
            `;
            UIManager.showModal(tagsModal);
            return;
        }
        
        // Add "All Notes" option
        const allNotesDiv = this.createTagOption('all', 'All Notes', 'Show all notes without filtering', notes.length, currentFilter);
        tagsContainer.appendChild(allNotesDiv);
        
        // Add individual tags
        allTags.forEach(tag => {
            const tagCount = notes.filter(note => note.tags && note.tags.includes(tag)).length;
            const tagDiv = this.createTagOption(tag, '#' + tag, 'Filter notes with this tag', tagCount, currentFilter);
            tagsContainer.appendChild(tagDiv);
        });
        
        UIManager.showModal(tagsModal);
    },
    
    createTagOption(tagValue, displayName, description, count, currentFilter) {
        const tagDiv = document.createElement('div');
        tagDiv.style.cssText = `
            border: 1px solid #444;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.2s;
            background: ${currentFilter === tagValue ? 'var(--primary)' : 'var(--bg-panel-light)'};
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        tagDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div>
                    <h4 style="margin: 0; color: white;">${displayName}</h4>
                    <p style="margin: 0; font-size: 12px; color: #ccc;">${description}</p>
                </div>
            </div>
            <span style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 12px; font-size: 12px; color: white;">
                ${count}
            </span>
        `;
        
        tagDiv.addEventListener('click', () => this.selectTagFromModal(tagValue));
        tagDiv.addEventListener('mouseenter', () => {
            if (currentFilter !== tagValue) {
                tagDiv.style.background = 'var(--bg-card)';
                tagDiv.style.borderColor = 'var(--primary)';
            }
        });
        tagDiv.addEventListener('mouseleave', () => {
            if (currentFilter !== tagValue) {
                tagDiv.style.background = 'var(--bg-panel-light)';
                tagDiv.style.borderColor = '#444';
            }
        });
        
        return tagDiv;
    },
    
    selectTagFromModal(tag) {
        this.closeTagsModal();
        window.selectTagHandler(tag);
    },
    
    closeTagsModal() {
        const tagsModal = document.getElementById('tagsModal');
        UIManager.hideModal(tagsModal);
    },
    
    clearTagFilter() {
        window.clearTagFilterHandler();
    },
    
    // Tag Utilities
    
    getTagStatistics(notes) {
        const tagStats = {};
        let totalTaggedNotes = 0;
        let totalUntaggedNotes = 0;
        
        notes.forEach(note => {
            if (note.tags && note.tags.length > 0) {
                totalTaggedNotes++;
                note.tags.forEach(tag => {
                    if (!tagStats[tag]) {
                        tagStats[tag] = {
                            count: 0,
                            notes: []
                        };
                    }
                    tagStats[tag].count++;
                    tagStats[tag].notes.push(note);
                });
            } else {
                totalUntaggedNotes++;
            }
        });
        
        return {
            tagStats,
            totalTaggedNotes,
            totalUntaggedNotes,
            totalTags: Object.keys(tagStats).length,
            mostUsedTag: this.getMostUsedTag(tagStats)
        };
    },
    
    getMostUsedTag(tagStats) {
        let mostUsed = null;
        let maxCount = 0;
        
        Object.entries(tagStats).forEach(([tag, stats]) => {
            if (stats.count > maxCount) {
                maxCount = stats.count;
                mostUsed = { tag, count: stats.count };
            }
        });
        
        return mostUsed;
    },
    
    getRelatedTags(notes, targetTag) {
        const relatedTags = {};
        
        notes.forEach(note => {
            if (note.tags && note.tags.includes(targetTag)) {
                note.tags.forEach(tag => {
                    if (tag !== targetTag) {
                        relatedTags[tag] = (relatedTags[tag] || 0) + 1;
                    }
                });
            }
        });
        
        return Object.entries(relatedTags)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count);
    },
    
    suggestTags(content, existingTags) {
        const suggestions = [];
        const contentLower = content.toLowerCase();
        
        // Simple keyword-based suggestions
        const keywords = {
            'meeting': ['meeting', 'agenda', 'attendees', 'action items'],
            'work': ['project', 'deadline', 'task', 'client', 'business'],
            'personal': ['personal', 'diary', 'journal', 'thoughts', 'feelings'],
            'todo': ['todo', 'task', 'checklist', 'reminder', 'due'],
            'idea': ['idea', 'concept', 'brainstorm', 'innovation', 'creative'],
            'learning': ['learn', 'study', 'course', 'education', 'knowledge']
        };
        
        Object.entries(keywords).forEach(([tag, words]) => {
            if (words.some(word => contentLower.includes(word))) {
                suggestions.push(tag);
            }
        });
        
        // Add existing tags that might be relevant
        existingTags.forEach(tag => {
            if (contentLower.includes(tag) && !suggestions.includes(tag)) {
                suggestions.push(tag);
            }
        });
        
        return suggestions.slice(0, 5); // Limit to 5 suggestions
    }
};