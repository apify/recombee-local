# Recombee Mock Service

A local mock implementation of the Recombee API for development and testing purposes.

## Overview

This service mimics the Recombee recommendation API, allowing local development without connecting to the real Recombee service. Recommendations are returned randomly from available items (quality doesn't matter for local dev).

## Running

### With Docker Compose

```bash
docker compose up recombee-mock
```

The service will be available at `http://localhost:9300`.

### Standalone

```bash
npm install
npm start -- --port 9300 --data ./data
```

## API Endpoints

### Health Check

- `GET /health` - Returns `{"status": "ok"}`

### Items

- `PUT /{dbId}/items/{itemId}` - Add an item
- `POST /{dbId}/items/{itemId}` - Set item values
- `GET /{dbId}/items/{itemId}` - Get item values
- `DELETE /{dbId}/items/{itemId}` - Delete an item

### Users

- `PUT /{dbId}/users/{userId}` - Add a user
- `POST /{dbId}/users/{userId}` - Set user values
- `DELETE /{dbId}/users/{userId}` - Delete a user

### Interactions

- `POST /{dbId}/detailviews/` - Add detail view
- `POST /{dbId}/purchases/` - Add purchase
- `POST /{dbId}/ratings/` - Add rating
- `POST /{dbId}/bookmarks/` - Add bookmark

### Recommendations

- `POST /{dbId}/recomms/items/{itemId}/` - Recommend items similar to an item
- `POST /{dbId}/recomms/users/{userId}/` - Recommend items to a user

### Search

- `POST /{dbId}/search/items/` - Search items by query (matches item IDs and property values)
- `POST /{dbId}/search/users/{userId}/items/` - Personalized search (same as regular search in mock)

Search request body:
```json
{
  "searchQuery": "your search term",
  "count": 10
}
```

### Batch Operations

- `POST /{dbId}/batch/` - Execute multiple operations in a single request

## SDK Configuration

To use with the `recombee-api-client` SDK:

```javascript
const client = new RecombeeClient('local-dev', 'mock-token', {
  baseUri: 'localhost:9300'
});
```

## Storage

Data is stored in JSON files in the data directory (one file per database). The structure is:

```json
{
  "items": { "item-1": { "title": "Item 1" } },
  "users": { "user-1": { "name": "User 1" } },
  "interactions": {
    "detailViews": [],
    "purchases": [],
    "ratings": [],
    "bookmarks": []
  }
}
```

## Authentication

This mock service does not validate HMAC signatures. All requests are accepted regardless of authentication parameters.
