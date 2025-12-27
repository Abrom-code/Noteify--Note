// Storage Operations

const StorageManager = {
    
    // User Notes Operations
    
    loadUserNotes(userId) {
        const userNotesKey = 'notes_' + userId;
        return JSON.parse(localStorage.getItem(userNotesKey)) || [];
    },
    
    saveUserNotes(userId, notes) {
        const userNotesKey = 'notes_' + userId;
        localStorage.setItem(userNotesKey, JSON.stringify(notes));
    },
    
    // Scratch Pad Operations
    
    loadScratchPad(userId) {
        const scratchKey = 'scratch_' + userId;
        return localStorage.getItem(scratchKey) || '';
    },
    
    saveScratchPad(userId, content) {
        const scratchKey = 'scratch_' + userId;
        localStorage.setItem(scratchKey, content);
    },
    
    // User Operations
    
    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    
    removeCurrentUser() {
        localStorage.removeItem('currentUser');
    },
    
    // Export/Import Operations
    
    exportNotes(userId, userName, notes) {
        const exportData = {
            user: userName,
            userId: userId,
            exportDate: new Date().toISOString(),
            notesCount: notes.length,
            notes: notes,
            version: '1.0'
        };
        
        return JSON.stringify(exportData, null, 2);
    },
    
    downloadExport(data, filename) {
        const dataBlob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
};