import fs from 'fs';
import path from 'path';

export class JsonStore {
    constructor(dataDir) {
        this.dataDir = dataDir;
        this.ensureDataDir();
    }

    ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    getDbPath(dbId) {
        return path.join(this.dataDir, `${dbId}.json`);
    }

    loadDb(dbId) {
        const dbPath = this.getDbPath(dbId);
        if (fs.existsSync(dbPath)) {
            try {
                const data = fs.readFileSync(dbPath, 'utf8');
                return JSON.parse(data);
            } catch (err) {
                console.error(`Error loading database ${dbId}:`, err);
                return this.createEmptyDb();
            }
        }
        return this.createEmptyDb();
    }

    saveDb(dbId, data) {
        const dbPath = this.getDbPath(dbId);
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    }

    createEmptyDb() {
        return {
            items: {},
            users: {},
            interactions: {
                detailViews: [],
                purchases: [],
                ratings: [],
                bookmarks: [],
            },
        };
    }

    // Item operations
    getItem(dbId, itemId) {
        const db = this.loadDb(dbId);
        return db.items[itemId] || null;
    }

    setItem(dbId, itemId, values = {}) {
        const db = this.loadDb(dbId);
        db.items[itemId] = { ...db.items[itemId], ...values };
        this.saveDb(dbId, db);
        return db.items[itemId];
    }

    deleteItem(dbId, itemId) {
        const db = this.loadDb(dbId);
        const existed = itemId in db.items;
        delete db.items[itemId];
        this.saveDb(dbId, db);
        return existed;
    }

    getAllItems(dbId) {
        const db = this.loadDb(dbId);
        return db.items;
    }

    // User operations
    getUser(dbId, userId) {
        const db = this.loadDb(dbId);
        return db.users[userId] || null;
    }

    setUser(dbId, userId, values = {}) {
        const db = this.loadDb(dbId);
        db.users[userId] = { ...db.users[userId], ...values };
        this.saveDb(dbId, db);
        return db.users[userId];
    }

    deleteUser(dbId, userId) {
        const db = this.loadDb(dbId);
        const existed = userId in db.users;
        delete db.users[userId];
        this.saveDb(dbId, db);
        return existed;
    }

    // Interaction operations
    addInteraction(dbId, type, data) {
        const db = this.loadDb(dbId);
        const interaction = {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
        };
        db.interactions[type].push(interaction);
        this.saveDb(dbId, db);
        return interaction;
    }
}
