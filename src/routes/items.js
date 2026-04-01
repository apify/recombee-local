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

    // GET /{dbId}/items/list/ - ListItems
    router.get('/items/list/', (req, res) => {
        const { dbId } = req.params;
        const { filter, count, offset, returnProperties, includedProperties } = req.query;

        // filter is ignored — it's a ReQL expression (Recombee's custom query language)
        // and implementing a ReQL parser/evaluator is out of scope for this mock
        const limitCount = count !== undefined ? parseInt(count, 10) : null;
        const skipOffset = offset !== undefined ? parseInt(offset, 10) : 0;
        const withProperties = returnProperties === 'true';
        const propertyList = includedProperties
            ? includedProperties.split(',').map((p) => p.trim()).filter(Boolean)
            : null;

        const allItems = store.getAllItems(dbId);
        let entries = Object.entries(allItems).slice(skipOffset);
        if (limitCount !== null) {
            entries = entries.slice(0, limitCount);
        }

        const result = entries.map(([itemId, values]) => {
            if (!withProperties) {
                return itemId;
            }
            const filteredValues = propertyList
                ? Object.fromEntries(propertyList.filter((p) => p in values).map((p) => [p, values[p]]))
                : values;
            return { itemId, ...filteredValues };
        });

        res.json(result);
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
