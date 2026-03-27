// Notes Management

const NotesManager = {
    
    // Utility Functions
    
    extractTags(text) {
        const tagRegex = /#(\w+)/g;
        const tags = [];
        let match;
        
        while ((match = tagRegex.exec(text)) !== null) {
            tags.push(match[1].toLowerCase());
        }
        
        return [...new Set(tags)]; // Remove duplicates
    },
    
    getAllTags(notes) {
        const allTags = new Set();
        notes.forEach(note => {
            if (note.tags) {
                note.tags.forEach(tag => allTags.add(tag));
            }
        });
        return Array.from(allTags).sort();
    },
    
    // Sorting Functions
    
    sortNotes(notes, sortBy) {
        const sortedNotes = [...notes];
        
        switch(sortBy) {
            case 'newest':
                return sortedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sortedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'title':
                return sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
            case 'updated':
                return sortedNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            case 'tags':
                return sortedNotes.sort((a, b) => {
                    const aTag = a.tags && a.tags.length > 0 ? a.tags[0] : 'zzz';
                    const bTag = b.tags && b.tags.length > 0 ? b.tags[0] : 'zzz';
                    return aTag.localeCompare(bTag);
                });
            default:
                return sortedNotes;
        }
    },
    
    filterNotesByTag(notes, tag) {
        if (tag === 'all') return notes;
        return notes.filter(note => note.tags && note.tags.includes(tag));
    },
    
    groupNotesByTag(notes) {
        const groups = {};
        const untagged = [];
        
        notes.forEach(note => {
            if (note.tags && note.tags.length > 0) {
                note.tags.forEach(tag => {
                    if (!groups[tag]) {
                        groups[tag] = [];
                    }
                    groups[tag].push(note);
                });
            } else {
                untagged.push(note);
            }
        });
        
        return { groups, untagged };
    },
    
    // Note Operations
    
    createNote(title, body) {
        return {
            id: Date.now(),
            title: title.trim(),
            body: body.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: this.extractTags(body)
        };
    },
    
    updateNote(existingNote, title, body) {
        return {
            ...existingNote,
            title: title.trim(),
            body: body.trim(),
            updatedAt: new Date().toISOString(),
            tags: this.extractTags(body)
        };
    },
    
    // Rendering Functions
    
    createNoteCard(note, originalIndex) {
        const card = document.createElement("div");
        card.className = "note-card";

        const createdDate = new Date(note.createdAt).toLocaleDateString();
        const updatedDate = new Date(note.updatedAt).toLocaleDateString();
        const isUpdated = note.createdAt !== note.updatedAt;

        const tagsHtml = note.tags && note.tags.length > 0 
            ? '<div class="note-tags" style="margin: 12px 0 8px 0;">' +
                note.tags.map(tag => '<span style="' +
                    'background: linear-gradient(135deg, #2dabff, #4a90e2); ' +
                    'color: white; ' +
                    'padding: 4px 10px; ' +
                    'border-radius: 16px; ' +
                    'font-size: 10px; ' +
                    'font-weight: 500;' +
                    'margin-right: 6px;' +
                    'margin-bottom: 4px;' +
                    'display: inline-block;' +
                    'box-shadow: 0 2px 4px rgba(45, 171, 255, 0.3);' +
                '">#' + tag + '</span>').join('') +
               '</div>'
            : '';

        const previewText = note.body.length > 150 ? note.body.substring(0, 150) + '...' : note.body;

        card.innerHTML = `
            <div class="note-header" style="margin-bottom: 12px;">
                <h4 style="
                    margin: 0; 
                    color: #fff; 
                    font-size: 16px; 
                    font-weight: 600;
                    line-height: 1.3;
                    word-wrap: break-word;
                ">${note.title}</h4>
            </div>
            
            <div class="note-content" style="margin-bottom: 12px;">
                <p style="
                    margin: 0; 
                    color: #ccc; 
                    line-height: 1.5;
                    font-size: 13px;
                    word-wrap: break-word;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                ">
                    ${previewText}
                </p>
            </div>
            
            ${tagsHtml}
            
            <div class="note-footer" style="
                border-top: 1px solid rgba(255,255,255,0.1);
                padding-top: 12px;
                margin-top: auto;
            ">
                <div class="note-date" style="
                    font-size: 10px; 
                    color: #888; 
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <span>${createdDate}</span>
                    ${isUpdated ? '<span style="color: #ffd13d;">' + updatedDate + '</span>' : ''}
                </div>
                
                <div class="card-actions" style="
                    display: flex; 
                    gap: 8px;
                    justify-content: flex-end;
                ">
                    <button onclick="NotesManager.editNote(${originalIndex})" style="
                        background: linear-gradient(135deg, #007bff, #0056b3); 
                        color: white; 
                        border: none; 
                        padding: 8px 14px; 
                        border-radius: 6px; 
                        cursor: pointer; 
                        font-size: 11px;
                        font-weight: 500;
                        transition: all 0.2s;
                        box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    " onmouseover="
                        this.style.transform='translateY(-1px)';
                        this.style.boxShadow='0 4px 8px rgba(0, 123, 255, 0.4)';
                    " onmouseout="
                        this.style.transform='translateY(0)';
                        this.style.boxShadow='0 2px 4px rgba(0, 123, 255, 0.3)';
                    ">
                        <span>Edit</span>
                    </button>
                    
                    <button onclick="NotesManager.deleteNote(${originalIndex})" style="
                        background: linear-gradient(135deg, #dc3545, #c82333); 
                        color: white; 
                        border: none; 
                        padding: 8px 14px; 
                        border-radius: 6px; 
                        cursor: pointer; 
                        font-size: 11px;
                        font-weight: 500;
                        transition: all 0.2s;
                        box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    " onmouseover="
                        this.style.transform='translateY(-1px)';
                        this.style.boxShadow='0 4px 8px rgba(220, 53, 69, 0.4)';
                    " onmouseout="
                        this.style.transform='translateY(0)';
                        this.style.boxShadow='0 2px 4px rgba(220, 53, 69, 0.3)';
                    ">
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        `;

        // Enhanced card styling
        card.style.cssText = `
            background: var(--bg-card);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            min-height: 200px;
            position: relative;
            overflow: hidden;
        `;

        // Add hover effects
        card.addEventListener('mouseenter', function() {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.25)';
            card.style.borderColor = 'rgba(45, 171, 255, 0.3)';
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            card.style.borderColor = 'rgba(255,255,255,0.1)';
        });

        // Add click to expand functionality
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                UIManager.expandNote(note);
            }
        });

        return card;
    },
    
    // Note Actions
    
    editNote(index) {
        window.editNoteHandler(index);
    },
    
    deleteNote(index) {
        window.deleteNoteHandler(index);
    }
};