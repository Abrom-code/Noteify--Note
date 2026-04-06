// Noteify API client — pure PHP/MySQL backend
// Adjust API_BASE to match your server path.
// XAMPP example: const API_BASE = '/Noteify--Note/backend';
// If served from web root: const API_BASE = '/backend';
const API_BASE = '/Noteify--Note/backend';

const NoteifyAPI = {

    _token() {
        return localStorage.getItem('noteify_token') || '';
    },

    _headers() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this._token()}`
        };
    },

    async _json(res) {
        const text = await res.text();
        if (!text || !text.trim()) throw new Error('Empty response from server');
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Server response:', text);
            throw new Error('Server error — check PHP logs');
        }
        if (!data.success) throw new Error(data.error || 'API error');
        return data;
    },

    // ── Auth ──────────────────────────────────────────────────────────────

    async register(name, email, password) {
        const res = await fetch(`${API_BASE}/auth/register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await this._json(res);
        this._saveSession(data);
        return data;
    },

    async login(email, password) {
        const res = await fetch(`${API_BASE}/auth/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await this._json(res);
        this._saveSession(data);
        return data;
    },

    async logout() {
        const token = this._token();
        if (token) {
            await fetch(`${API_BASE}/auth/logout.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            }).catch(() => { });
        }
        localStorage.removeItem('noteify_token');
        localStorage.removeItem('currentUser');
    },

    async forgotPassword(email) {
        const res = await fetch(`${API_BASE}/auth/forgot_password.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return this._json(res);
    },

    async resetPassword(token, password) {
        const res = await fetch(`${API_BASE}/auth/reset_password.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        });
        return this._json(res);
    },

    _saveSession(data) {
        localStorage.setItem('noteify_token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
    },

    // ── Notes ─────────────────────────────────────────────────────────────

    async getNotes() {
        const res = await fetch(`${API_BASE}/api/get_notes.php`, { headers: this._headers() });
        return (await this._json(res)).notes;
    },

    async createNote(title, body, tags = []) {
        const res = await fetch(`${API_BASE}/api/create_note.php`, {
            method: 'POST', headers: this._headers(),
            body: JSON.stringify({ title, body, tags })
        });
        return (await this._json(res)).note;
    },

    async updateNote(id, title, body, tags = []) {
        const res = await fetch(`${API_BASE}/api/update_note.php`, {
            method: 'POST', headers: this._headers(),
            body: JSON.stringify({ id, title, body, tags })
        });
        return (await this._json(res)).note;
    },

    async deleteNote(id) {
        const res = await fetch(`${API_BASE}/api/delete_note.php`, {
            method: 'POST', headers: this._headers(),
            body: JSON.stringify({ id })
        });
        return this._json(res);
    },

    // ── Profile ───────────────────────────────────────────────────────────

    async updateProfile({ name, email, password, avatar } = {}) {
        const body = {};
        if (name     !== undefined) body.name     = name;
        if (email    !== undefined) body.email    = email;
        if (password !== undefined) body.password = password;
        if (avatar   !== undefined) body.avatar   = avatar;

        const res = await fetch(`${API_BASE}/auth/update_profile.php`, {
            method: 'POST', headers: this._headers(),
            body: JSON.stringify(body)
        });
        const data = await this._json(res);
        // Keep localStorage in sync
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return data.user;
    }
};
