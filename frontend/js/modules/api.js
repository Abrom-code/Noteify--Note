// Noteify PHP Backend API client
// Adjust API_BASE to match your server setup
const API_BASE = '/backend';

const NoteifyAPI = {

    // ── Auth ──────────────────────────────────────────────────────────────

    /**
     * Call after every Firebase login to sync the user to MySQL
     * and receive a PHP session token.
     * Stores the token in localStorage as 'noteify_token'.
     */
    async syncUser(firebaseUser) {
        const res = await fetch(`${API_BASE}/auth/sync_user.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firebase_uid: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                email: firebaseUser.email,
                photo_url: firebaseUser.photoURL || '',
                provider: firebaseUser.providerData[0]?.providerId || 'email'
            })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to sync user');
        localStorage.setItem('noteify_token', data.token);
        return data;
    },

    async logoutBackend() {
        const token = localStorage.getItem('noteify_token');
        if (!token) return;
        await fetch(`${API_BASE}/auth/logout.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        localStorage.removeItem('noteify_token');
    },

    // ── Helpers ───────────────────────────────────────────────────────────

    _authHeaders() {
        const token = localStorage.getItem('noteify_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    },

    async _handleResponse(res) {
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'API error');
        return data;
    },

    // ── Notes CRUD ────────────────────────────────────────────────────────

    async getNotes() {
        const res = await fetch(`${API_BASE}/api/get_notes.php`, {
            headers: this._authHeaders()
        });
        return (await this._handleResponse(res)).notes;
    },

    async createNote(title, body, tags = []) {
        const res = await fetch(`${API_BASE}/api/create_note.php`, {
            method: 'POST',
            headers: this._authHeaders(),
            body: JSON.stringify({ title, body, tags })
        });
        return (await this._handleResponse(res)).note;
    },

    async updateNote(id, title, body, tags = []) {
        const res = await fetch(`${API_BASE}/api/update_note.php`, {
            method: 'POST',
            headers: this._authHeaders(),
            body: JSON.stringify({ id, title, body, tags })
        });
        return (await this._handleResponse(res)).note;
    },

    async deleteNote(id) {
        const res = await fetch(`${API_BASE}/api/delete_note.php`, {
            method: 'POST',
            headers: this._authHeaders(),
            body: JSON.stringify({ id })
        });
        return this._handleResponse(res);
    }
};
