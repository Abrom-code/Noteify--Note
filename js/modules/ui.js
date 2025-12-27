// UI Utilities

const UIManager = {
    
    // Notification System
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-size: 14px;
            line-height: 1.4;
        `;
        
        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        notification.innerHTML = `<span>${message}</span>`;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    },
    
    // Welcome Message
    
    displayWelcomeMessage(userName) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.style.cssText = `
            background: linear-gradient(135deg, #2dabff, #4a90e2);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(45, 171, 255, 0.3);
        `;
        welcomeDiv.innerHTML = `
            <h3 style="margin: 0 0 5px 0;">Welcome back, ${userName}!</h3>
            <p style="margin: 0; opacity: 0.9;">Ready to organize your thoughts?</p>
        `;
        
        const mainContent = document.querySelector('.main-content');
        const firstH2 = mainContent.querySelector('h2');
        if (firstH2) {
            mainContent.insertBefore(welcomeDiv, firstH2);
        }
    },
    
    // Filter Status
    
    updateFilterStatus(filterByTag, notes) {
        const filterStatus = document.getElementById('filterStatus');
        if (!filterStatus) return;
        
        if (filterByTag === 'all') {
            filterStatus.style.display = 'none';
        } else {
            const count = notes.filter(note => note.tags && note.tags.includes(filterByTag)).length;
            filterStatus.innerHTML = `
                #${filterByTag} (${count})
                <span onclick="TagsManager.clearTagFilter()" style="
                    margin-left: 6px;
                    cursor: pointer;
                    background: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                ">×</span>
            `;
            filterStatus.style.display = 'block';
        }
    },
    
    // Notes Count
    
    updateNotesCount(count) {
        const notesHeader = document.querySelector('.main-content h3');
        if (notesHeader && notesHeader.textContent.includes('Notes')) {
            notesHeader.textContent = 'Notes (' + count + ')';
        }
    },
    
    // Modal Utilities
    
    showModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
        }
    },
    
    hideModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
        }
    },
    
    // Utility Functions
    
    debounce(func, wait = 1000) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    expandNote(note) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--bg-card);
            color: white;
            padding: 32px;
            border-radius: 16px;
            max-width: 700px;
            width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            margin: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
            animation: slideUp 0.35s ease;
        `;
        
        const createdDate = new Date(note.createdAt).toLocaleString();
        const updatedDate = new Date(note.updatedAt).toLocaleString();
        const isUpdated = note.createdAt !== note.updatedAt;
        
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 24px;">
                <h2 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">${note.title}</h2>
                <button onclick="this.closest('.expanded-note-modal').remove()" style="
                    background: var(--bg-panel-light);
                    border: 1px solid rgba(255,255,255,0.2);
                    font-size: 20px;
                    cursor: pointer;
                    color: #999;
                    padding: 8px;
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                " onmouseover="
                    this.style.background='var(--bg-panel)';
                    this.style.color='white';
                " onmouseout="
                    this.style.background='var(--bg-panel-light)';
                    this.style.color='#999';
                ">×</button>
            </div>
            <div style="
                white-space: pre-wrap; 
                line-height: 1.6; 
                color: #ccc; 
                margin-bottom: 24px;
                font-size: 15px;
                background: var(--bg-panel-light);
                padding: 20px;
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.1);
            ">
                ${note.body}
            </div>
            <div style="
                border-top: 1px solid rgba(255,255,255,0.1); 
                padding-top: 20px; 
                font-size: 13px; 
                color: #999;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <span>Created: ${createdDate}</span>
                ${isUpdated ? '<span>Last updated: ' + updatedDate + '</span>' : ''}
            </div>
        `;
        
        modal.className = 'expanded-note-modal';
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
};