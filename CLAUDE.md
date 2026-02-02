# Claude Code Context

This is a mock implementation of the Recombee recommendation API for local development in the Apify dev stack.

## Project Purpose

Allows local development of apify-core features that use Recombee without connecting to the real service. The mock returns random/simple results since recommendation quality doesn't matter for local dev.

## Architecture

```
src/
├── index.js              # CLI entry point, parses --port and --data args
├── server.js             # Express app setup, middleware, route registration
├── routes/
│   ├── health.js         # GET /health
│   ├── items.js          # Item CRUD: PUT/POST/GET/DELETE /{dbId}/items/{itemId}
│   ├── users.js          # User CRUD: PUT/POST/DELETE /{dbId}/users/{userId}
│   ├── interactions.js   # POST /{dbId}/detailviews|purchases|ratings|bookmarks/
│   ├── recommendations.js # POST /{dbId}/recomms/items|users/{id}/
│   ├── search.js         # POST /{dbId}/search/items/ and /search/users/{id}/items/
│   └── batch.js          # POST /{dbId}/batch/ - executes multiple operations
├── storage/
│   └── json-store.js     # JSON file-based persistence (one file per dbId)
└── utils/
    ├── random-recommender.js  # Returns random items for recommendations
    └── search.js              # Simple text search across item properties
```

## Recombee API Reference

- **Official API Docs**: https://docs.recombee.com/api
- **Node.js SDK**: https://github.com/recombee/node-api-client
- **SDK supports `baseUri` option** for pointing to this mock: `new RecombeeClient(db, token, { baseUri: 'localhost:9300' })`

### Key API Patterns

- All endpoints are prefixed with `/{databaseId}/`
- Authentication uses HMAC signatures via `hmac_timestamp` and `hmac_sign` query params - **we skip validation entirely**
- Batch endpoint wraps multiple requests: `{ requests: [{ method, path, params }] }`
- Recommendation responses include `recommId` (UUID) and `recomms` array with `{ id, values }`

## Implemented Endpoints

| Endpoint | Method | Recombee Operation |
|----------|--------|-------------------|
| `/health` | GET | Health check (not in real API) |
| `/{dbId}/items/{itemId}` | PUT | AddItem |
| `/{dbId}/items/{itemId}` | POST | SetItemValues |
| `/{dbId}/items/{itemId}` | GET | GetItemValues |
| `/{dbId}/items/{itemId}` | DELETE | DeleteItem |
| `/{dbId}/users/{userId}` | PUT | AddUser |
| `/{dbId}/users/{userId}` | POST | SetUserValues |
| `/{dbId}/users/{userId}` | DELETE | DeleteUser |
| `/{dbId}/detailviews/` | POST | AddDetailView |
| `/{dbId}/purchases/` | POST | AddPurchase |
| `/{dbId}/ratings/` | POST | AddRating |
| `/{dbId}/bookmarks/` | POST | AddBookmark |
| `/{dbId}/recomms/items/{itemId}/` | POST | RecommendItemsToItem |
| `/{dbId}/recomms/users/{userId}/` | POST | RecommendItemsToUser |
| `/{dbId}/search/items/` | POST | SearchItems |
| `/{dbId}/search/users/{userId}/items/` | POST | SearchItemsForUser |
| `/{dbId}/batch/` | POST | Batch |

## Adding New Endpoints

1. Create route file in `src/routes/` following existing patterns
2. Register in `src/server.js` with `app.use('/:dbId', createXxxRoutes(store))`
3. Add batch support in `src/routes/batch.js` `executeRequest()` function
4. Update README.md

### Route Pattern

```javascript
import { Router } from 'express';

export function createXxxRoutes(store) {
    const router = Router({ mergeParams: true }); // mergeParams to access :dbId

    router.post('/endpoint/', (req, res) => {
        const { dbId } = req.params;
        // ... implementation
        res.json({ ok: true });
    });

    return router;
}
```

## Storage

- JSON files in data directory, one per database: `{dataDir}/{dbId}.json`
- Structure: `{ items: {}, users: {}, interactions: { detailViews: [], purchases: [], ratings: [], bookmarks: [] } }`
- Store methods: `getItem`, `setItem`, `deleteItem`, `getAllItems`, `getUser`, `setUser`, `deleteUser`, `addInteraction`

## Integration with apify-dev-stack

The dev-stack Dockerfile at `apify-dev-stack/src/recombee-mock/Dockerfile` clones this repo from GitHub during build (same pattern as algolite). Use `RECOMBEE_LOCAL_GIT_REF` build arg to pin a specific commit. To test local changes before pushing:

```bash
# In recombee-local directory
node src/index.js --port 9300 --data ./data
```

## Not Implemented (add if needed)

- Property definitions (`/{dbId}/properties/items/`, `/{dbId}/properties/users/`)
- List items/users (`/{dbId}/items/list/`, `/{dbId}/users/list/`)
- Cart additions (`/{dbId}/cartadditions/`)
- Set view portions (`/{dbId}/viewportions/`)
- Segments (`/{dbId}/items/{itemId}/segments/`)
- Series and series items
- Synonyms for search
- Filter and booster expressions (currently ignored)

Check https://docs.recombee.com/api for full endpoint reference when extending.
