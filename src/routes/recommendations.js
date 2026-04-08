import { Router } from 'express';
import { getRandomRecommendations } from '../utils/random-recommender.js';

export function createRecommendationRoutes(store) {
    const router = Router({ mergeParams: true });

    // POST /{dbId}/recomms/items/{itemId}/items/ - RecommendItemsToItem
    router.post('/recomms/items/:itemId/items/', (req, res) => {
        const { dbId, itemId } = req.params;
        const { count = 10 } = req.body;

        const items = store.getAllItems(dbId);
        const recommendations = getRandomRecommendations(items, count, itemId);

        res.json(recommendations);
    });

    // POST /{dbId}/recomms/users/{userId}/items/ - RecommendItemsToUser
    router.post('/recomms/users/:userId/items/', (req, res) => {
        const { dbId } = req.params;
        const { count = 10 } = req.body;

        const items = store.getAllItems(dbId);
        const recommendations = getRandomRecommendations(items, count);

        res.json(recommendations);
    });

    // POST /{dbId}/recomms/next/items/{recommendationId}/ - RecommendNextItems
    router.post('/recomms/next/items/:recommendationId/', (req, res) => {
        const { dbId } = req.params;
        const { count = 10 } = req.body;

        const items = store.getAllItems(dbId);
        const recommendations = getRandomRecommendations(items, count);

        res.json(recommendations);
    });

    return router;
}
