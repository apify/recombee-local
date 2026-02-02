import { Router } from 'express';

export function createUserRoutes(store) {
    const router = Router({ mergeParams: true });

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
