import { Router } from 'express';
import { searchItems } from '../utils/search.js';

export function createSearchRoutes(store) {
    const router = Router({ mergeParams: true });

    // POST /{dbId}/search/users/{userId}/items/ - SearchItems (personalized search)
    router.post('/search/users/:userId/items/', (req, res) => {
        const { dbId } = req.params;
        const { searchQuery = '', count = 10 } = req.body;

        // For mock purposes, personalized search works the same as regular search
        const items = store.getAllItems(dbId);
        const results = searchItems(items, searchQuery, count);

        res.json(results);
    });

    // GET /{dbId}/search/users/{userId}/items/ - SearchItems
    router.get('/search/users/:userId/items/', (req, res) => {
        const { dbId } = req.params;
        const { searchQuery = '', count = 10 } = req.query;

        const items = store.getAllItems(dbId);
        const results = searchItems(items, searchQuery, parseInt(count, 10));

        res.json(results);
    });

    return router;
}
