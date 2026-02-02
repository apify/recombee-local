import express from 'express';
import { JsonStore } from './storage/json-store.js';
import { createHealthRoutes } from './routes/health.js';
import { createItemRoutes } from './routes/items.js';
import { createUserRoutes } from './routes/users.js';
import { createInteractionRoutes } from './routes/interactions.js';
import { createRecommendationRoutes } from './routes/recommendations.js';
import { createBatchRoutes } from './routes/batch.js';
import { createSearchRoutes } from './routes/search.js';

export function createServer({ dataDir }) {
    const app = express();
    const store = new JsonStore(dataDir);

    // Middleware
    app.use(express.json());

    // Request logging
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
        next();
    });

    // Health check (no dbId prefix)
    app.use('/', createHealthRoutes());

    // API routes with dbId prefix
    app.use('/:dbId', createItemRoutes(store));
    app.use('/:dbId', createUserRoutes(store));
    app.use('/:dbId', createInteractionRoutes(store));
    app.use('/:dbId', createRecommendationRoutes(store));
    app.use('/:dbId', createSearchRoutes(store));
    app.use('/:dbId', createBatchRoutes(store));

    // Error handling
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
    });

    return app;
}
