import { Router } from 'express';

export function createUserRoutes(store) {
    const router = Router({ mergeParams: true });

    // GET /{dbId}/users/list/ - ListUsers
    router.get('/users/list/', (req, res) => {
        const { dbId } = req.params;
        const count = parseInt(req.query.count, 10) || 100;
        const offset = parseInt(req.query.offset, 10) || 0;
        const returnProperties = req.query.returnProperties === 'true' || req.query.returnProperties === true;
        const includedProperties = req.query.includedProperties
            ? (Array.isArray(req.query.includedProperties) ? req.query.includedProperties : [req.query.includedProperties])
            : null;

        const allUsers = store.getAllUsers(dbId);
        const userEntries = Object.entries(allUsers).slice(offset, offset + count);

        const users = userEntries.map(([userId, values]) => {
            if (!returnProperties) {
                return { userId };
            }
            const filteredValues = includedProperties
                ? Object.fromEntries(includedProperties.filter(p => p in values).map(p => [p, values[p]]))
                : values;
            return { userId, values: filteredValues };
        });

        res.json({ users });
    });

    // PUT /{dbId}/users/{userId} - AddUser
    router.put('/users/:userId', (req, res) => {
        const { dbId, userId } = req.params;
        store.setUser(dbId, userId, {});
        res.json({ ok: true });
    });

    // POST /{dbId}/users/{userId} - SetUserValues
    router.post('/users/:userId', (req, res) => {
        const { dbId, userId } = req.params;
        const values = req.body || {};
        store.setUser(dbId, userId, values);
        res.json({ ok: true });
    });

    // DELETE /{dbId}/users/{userId} - DeleteUser
    router.delete('/users/:userId', (req, res) => {
        const { dbId, userId } = req.params;
        const existed = store.deleteUser(dbId, userId);
        if (!existed) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ ok: true });
    });

    return router;
}
