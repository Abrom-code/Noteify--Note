// Noteify Configuration

// Note Templates
const noteTemplates = [
    {
        id: 'meeting',
        title: 'Meeting Notes',
        template: `Meeting: [Meeting Title]
Date: ${new Date().toLocaleDateString()}
Attendees: 
- 
- 

Agenda:
1. 
2. 
3. 

Notes:


Action Items:
- [ ] 
- [ ] 

#meeting #work`
    },
    {
        id: 'todo',
        title: 'To-Do List',
        template: `To-Do: [Task Category]
Date: ${new Date().toLocaleDateString()}

Priority Tasks:
- [ ] 
- [ ] 
- [ ] 

Regular Tasks:
- [ ] 
- [ ] 
- [ ] 

Notes:


#todo #tasks`
    },
    {
        id: 'journal',
        title: 'Daily Journal',
        template: `Daily Journal - ${new Date().toLocaleDateString()}

Mood: Happy / Neutral / Sad (circle one)

Today's Highlights:
- 
- 
- 

Challenges:
- 
- 

Tomorrow's Goals:
- 
- 

Gratitude:
- 
- 

#journal #personal #daily`
    },
    {
        id: 'project',
        title: 'Project Planning',
        template: `Project: [Project Name]
Start Date: ${new Date().toLocaleDateString()}
Deadline: 

Objective:


Key Milestones:
1. 
2. 
3. 

Resources Needed:
- 
- 

Risks & Mitigation:
- 
- 

#project #planning #work`
    },
    {
        id: 'idea',
        title: 'Idea Capture',
        template: `Idea: [Brief Title]
Date: ${new Date().toLocaleDateString()}

Core Concept:


Why is this interesting?


Potential Applications:
- 
- 
- 

Next Steps:
- 
- 

Related Ideas:
- 
- 

#idea #brainstorm #creative`
    },
    {
        id: 'learning',
        title: 'Learning Notes',
        template: `Learning: [Topic/Course Name]
Date: ${new Date().toLocaleDateString()}

Key Concepts:
1. 
2. 
3. 

Important Details:


Examples:
- 
- 

Questions to Explore:
- 
- 

Action Items:
- [ ] 
- [ ] 

#learning #education #notes`
    }
];

// App Configuration
const AppConfig = {
    // Storage keys
    STORAGE_KEYS: {
        USERS: 'users',
        CURRENT_USER: 'currentUser',
        NOTES_PREFIX: 'notes_',
        SCRATCH_PREFIX: 'scratch_'
    },
    
    // UI Settings
    UI: {
        NOTIFICATION_DURATION: 3000,
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 1000
    },
    
    // Note Settings
    NOTES: {
        MAX_TITLE_LENGTH: 100,
        MAX_BODY_LENGTH: 10000,
        PREVIEW_LENGTH: 150,
        WORDS_PREVIEW_LENGTH: 120
    },
    
    // Search Settings
    SEARCH: {
        MIN_QUERY_LENGTH: 1,
        MAX_QUERY_LENGTH: 100
    }
};