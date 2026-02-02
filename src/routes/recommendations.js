import { Router } from 'express';
import { getRandomRecommendations } from '../utils/random-recommender.js';

export function createRecommendationRoutes(store) {
    const router = Router({ mergeParams: true });

    // POST /{dbId}/recomms/items/{itemId}/ - RecommendItemsToItem
    router.post('/recomms/items/:itemId/', (req, res) => {
        const { dbId, itemId } = req.params;
        const { count = 10 } = req.body;

        const items = store.getAllItems(dbId);
        const recommendations = getRandomRecommendations(items, count, itemId);

        res.json(recommendations);
    });

    // POST /{dbId}/recomms/users/{userId}/ - RecommendItemsToUser
    router.post('/recomms/users/:userId/', (req, res) => {
        const { dbId } = req.params;
        const { count = 10 } = req.body;

        const items = store.getAllItems(dbId);
        const recommendations = getRandomRecommendations(items, count);

        res.json(recommendations);
    });

    return router;
}
