import { Router } from 'express';

export function createItemRoutes(store) {
    const router = Router({ mergeParams: true });

    // PUT /{dbId}/items/{itemId} - AddItem
    router.put('/items/:itemId', (req, res) => {
        const { dbId, itemId } = req.params;
        store.setItem(dbId, itemId, {});
        res.json({ ok: true });
    });

    // POST /{dbId}/items/{itemId} - SetItemValues
    router.post('/items/:itemId', (req, res) => {
        const { dbId, itemId } = req.params;
        const values = req.body || {};
        store.setItem(dbId, itemId, values);
        res.json({ ok: true });
    });

    // GET /{dbId}/items/{itemId} - GetItemValues
    router.get('/items/:itemId', (req, res) => {
        const { dbId, itemId } = req.params;
        const item = store.getItem(dbId, itemId);
        if (item === null) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    });

    // DELETE /{dbId}/items/{itemId} - DeleteItem
    router.delete('/items/:itemId', (req, res) => {
        const { dbId, itemId } = req.params;
        const existed = store.deleteItem(dbId, itemId);
        if (!existed) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ ok: true });
    });

    return router;
}
