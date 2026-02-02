import { Router } from 'express';

export function createInteractionRoutes(store) {
    const router = Router({ mergeParams: true });

    // POST /{dbId}/detailviews/ - AddDetailView
    router.post('/detailviews/', (req, res) => {
        const { dbId } = req.params;
        const { userId, itemId, timestamp, duration, cascadeCreate } = req.body;

        if (cascadeCreate) {
            store.setUser(dbId, userId, {});
            store.setItem(dbId, itemId, {});
        }

        store.addInteraction(dbId, 'detailViews', { userId, itemId, timestamp, duration });
        res.json({ ok: true });
    });

    // POST /{dbId}/purchases/ - AddPurchase
    router.post('/purchases/', (req, res) => {
        const { dbId } = req.params;
        const { userId, itemId, timestamp, amount, price, profit, cascadeCreate } = req.body;

        if (cascadeCreate) {
            store.setUser(dbId, userId, {});
            store.setItem(dbId, itemId, {});
        }

        store.addInteraction(dbId, 'purchases', { userId, itemId, timestamp, amount, price, profit });
        res.json({ ok: true });
    });

    // POST /{dbId}/ratings/ - AddRating
    router.post('/ratings/', (req, res) => {
        const { dbId } = req.params;
        const { userId, itemId, timestamp, rating, cascadeCreate } = req.body;

        if (cascadeCreate) {
            store.setUser(dbId, userId, {});
            store.setItem(dbId, itemId, {});
        }

        store.addInteraction(dbId, 'ratings', { userId, itemId, timestamp, rating });
        res.json({ ok: true });
    });

    // POST /{dbId}/bookmarks/ - AddBookmark
    router.post('/bookmarks/', (req, res) => {
        const { dbId } = req.params;
        const { userId, itemId, timestamp, cascadeCreate } = req.body;

        if (cascadeCreate) {
            store.setUser(dbId, userId, {});
            store.setItem(dbId, itemId, {});
        }

        store.addInteraction(dbId, 'bookmarks', { userId, itemId, timestamp });
        res.json({ ok: true });
    });

    return router;
}
