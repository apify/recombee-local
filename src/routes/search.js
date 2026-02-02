import { Router } from 'express';
import { searchItems } from '../utils/search.js';

export function createSearchRoutes(store) {
    const router = Router({ mergeParams: true });

    // POST /{dbId}/search/items/ - SearchItems
    router.post('/search/items/', (req, res) => {
        const { dbId } = req.params;
        const { searchQuery = '', count = 10 } = req.body;

        const items = store.getAllItems(dbId);
        const results = searchItems(items, searchQuery, count);

        res.json(results);
    });

    // POST /{dbId}/search/users/{userId}/items/ - SearchItemsForUser (personalized search)
    router.post('/search/users/:userId/items/', (req, res) => {
        const { dbId } = req.params;
        const { searchQuery = '', count = 10 } = req.body;

        // For mock purposes, personalized search works the same as regular search
        const items = store.getAllItems(dbId);
        const results = searchItems(items, searchQuery, count);

        res.json(results);
    });

    return router;
}
