import { Router } from 'express';

export function createScenarioRoutes(store) {
    const router = Router({ mergeParams: true });

    // GET /{dbId}/scenarios/ - ListScenarios
    // Real scenarios are configured in Recombee's Admin UI, so there's no way to derive them
    // from item/user data like recommendations. Seed db.scenarios in the data file (each entry
    // { id, endpoint }) to test A/B variant resolution locally; defaults to none configured.
    router.get('/scenarios/', (req, res) => {
        const { dbId } = req.params;
        res.json(store.getScenarios(dbId));
    });

    return router;
}
