import { Router } from 'express';
import { getRandomRecommendations } from '../utils/random-recommender.js';
import { searchItems } from '../utils/search.js';

export function createBatchRoutes(store) {
    const router = Router({ mergeParams: true });

    // POST /{dbId}/batch/ - Execute multiple operations
    router.post('/batch/', async (req, res) => {
        const { dbId } = req.params;
        const { requests = [] } = req.body;

        const results = [];

        for (const request of requests) {
            try {
                const result = executeRequest(store, dbId, request);
                results.push({ code: 200, json: result });
            } catch (err) {
                results.push({ code: 400, json: { error: err.message } });
            }
        }

        res.json(results);
    });

    return router;
}

function executeRequest(store, dbId, request) {
    const { method, path, params = {} } = request;

    // Parse path to extract resource type and id
    const pathParts = path.split('/').filter(Boolean);

    // Items - ListItems
    if (pathParts[0] === 'items' && pathParts[1] === 'list' && method === 'GET') {
        // filter is ignored — it's a ReQL expression (Recombee's custom query language)
        // and implementing a ReQL parser/evaluator is out of scope for this mock
        const limitCount = params.count !== undefined ? parseInt(params.count, 10) : null;
        const skipOffset = params.offset !== undefined ? parseInt(params.offset, 10) : 0;
        const withProperties = params.returnProperties === true || params.returnProperties === 'true';
        const propertyList = params.includedProperties
            ? (Array.isArray(params.includedProperties)
                ? params.includedProperties
                : params.includedProperties.split(',').map((p) => p.trim()).filter(Boolean))
            : null;

        const allItems = store.getAllItems(dbId);
        let entries = Object.entries(allItems).slice(skipOffset);
        if (limitCount !== null) {
            entries = entries.slice(0, limitCount);
        }

        return entries.map(([itemId, values]) => {
            if (!withProperties) {
                return itemId;
            }
            const filteredValues = propertyList
                ? Object.fromEntries(propertyList.filter((p) => p in values).map((p) => [p, values[p]]))
                : values;
            return { itemId, ...filteredValues };
        });
    }

    // Items
    if (pathParts[0] === 'items' && pathParts[1]) {
        const itemId = pathParts[1];
        if (method === 'PUT') {
            store.setItem(dbId, itemId, {});
            return { ok: true };
        }
        if (method === 'POST') {
            store.setItem(dbId, itemId, params);
            return { ok: true };
        }
        if (method === 'GET') {
            const item = store.getItem(dbId, itemId);
            if (item === null) throw new Error('Item not found');
            return item;
        }
        if (method === 'DELETE') {
            store.deleteItem(dbId, itemId);
            return { ok: true };
        }
    }

    // List Users
    if (pathParts[0] === 'users' && pathParts[1] === 'list' && method === 'GET') {
        const count = parseInt(params.count, 10) || 100;
        const offset = parseInt(params.offset, 10) || 0;
        const returnProperties = params.returnProperties === true || params.returnProperties === 'true';
        const includedProperties = params.includedProperties
            ? (Array.isArray(params.includedProperties) ? params.includedProperties : [params.includedProperties])
            : null;

        const allUsers = store.getAllUsers(dbId);
        const userEntries = Object.entries(allUsers).slice(offset, offset + count);

        const users = userEntries.map(([userId, values]) => {
            if (!returnProperties) {
                return { userId };
            }
            const filteredValues = includedProperties
                ? Object.fromEntries(includedProperties.filter(p => p in values).map(p => [p, values[p]]))
                : values;
            return { userId, values: filteredValues };
        });

        return { users };
    }

    // Users
    if (pathParts[0] === 'users' && pathParts[1]) {
        const userId = pathParts[1];
        if (method === 'PUT') {
            store.setUser(dbId, userId, {});
            return { ok: true };
        }
        if (method === 'POST') {
            store.setUser(dbId, userId, params);
            return { ok: true };
        }
        if (method === 'GET') {
            const user = store.getUser(dbId, userId);
            if (user === null) throw new Error('User not found');
            return user;
        }
        if (method === 'DELETE') {
            store.deleteUser(dbId, userId);
            return { ok: true };
        }
    }

    // Interactions
    if (pathParts[0] === 'detailviews' && method === 'POST') {
        if (params.cascadeCreate) {
            store.setUser(dbId, params.userId, {});
            store.setItem(dbId, params.itemId, {});
        }
        store.addInteraction(dbId, 'detailViews', params);
        return { ok: true };
    }

    if (pathParts[0] === 'purchases' && method === 'POST') {
        if (params.cascadeCreate) {
            store.setUser(dbId, params.userId, {});
            store.setItem(dbId, params.itemId, {});
        }
        store.addInteraction(dbId, 'purchases', params);
        return { ok: true };
    }

    if (pathParts[0] === 'ratings' && method === 'POST') {
        if (params.cascadeCreate) {
            store.setUser(dbId, params.userId, {});
            store.setItem(dbId, params.itemId, {});
        }
        store.addInteraction(dbId, 'ratings', params);
        return { ok: true };
    }

    if (pathParts[0] === 'bookmarks' && method === 'POST') {
        if (params.cascadeCreate) {
            store.setUser(dbId, params.userId, {});
            store.setItem(dbId, params.itemId, {});
        }
        store.addInteraction(dbId, 'bookmarks', params);
        return { ok: true };
    }

    // Recommendations
    if (pathParts[0] === 'recomms') {
        const items = store.getAllItems(dbId);
        const count = params.count || 10;

        if (pathParts[1] === 'items' && pathParts[2] && pathParts[3] === 'items') {
            return getRandomRecommendations(items, count, pathParts[2]);
        }
        if (pathParts[1] === 'users' && pathParts[2] && pathParts[3] === 'items') {
            return getRandomRecommendations(items, count);
        }
        if (pathParts[1] === 'next' && pathParts[2] === 'items' && pathParts[3]) {
            return getRandomRecommendations(items, count);
        }
    }

    // Search
    if (pathParts[0] === 'search' && (method === 'POST' || method === 'GET')) {
        const items = store.getAllItems(dbId);
        const count = params.count || 10;
        const query = params.searchQuery || '';

        // SearchItems - /search/users/{userId}/items/
        if (pathParts[1] === 'users' && pathParts[3] === 'items') {
            return searchItems(items, query, count);
        }
    }

    throw new Error(`Unknown operation: ${method} ${path}`);
}
