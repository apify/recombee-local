# Recombee API Reference

Source: https://docs.recombee.com/api | SDK: https://github.com/recombee/node-api-client

All endpoints are prefixed with `/{databaseId}/`. Authentication uses HMAC (`hmac_timestamp`, `hmac_sign` query params — skipped in mock).

---

## Items

### Add Item
`PUT /{databaseId}/items/{itemId}`

No body parameters.

### Get Item Values
`GET /{databaseId}/items/{itemId}`

No parameters.

### Set Item Values
`POST /{databaseId}/items/{itemId}`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `values` | object | yes | Property key-value pairs |
| `cascadeCreate` | boolean | no | Auto-create item if missing |

### Delete Item
`DELETE /{databaseId}/items/{itemId}`

No parameters.

### List Items
`GET /{databaseId}/items/list/`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `filter` | string (ReQL) | no | Boolean expression for filtering |
| `count` | integer | no | Number of items to return |
| `offset` | integer | no | Items to skip |
| `returnProperties` | boolean | no | Include property values in response |
| `includedProperties` | string[] | no | Specific properties to return |

Response: array of item IDs, or item objects if `returnProperties=true`.

### Update More Items (bulk)
`POST /{databaseId}/more-items/`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `filter` | string (ReQL) | yes | Selects items to update |
| `changes` | object | yes | Property modifications |

### Delete More Items (bulk)
`DELETE /{databaseId}/more-items/`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `filter` | string (ReQL) | yes | Selects items to delete |

---

## Item Properties

### Add Item Property
`PUT /{databaseId}/items/properties/{propertyName}`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | enum | yes | `int` \| `double` \| `string` \| `boolean` \| `timestamp` \| `set` \| `image` \| `imageList` |

### Get Item Property Info
`GET /{databaseId}/items/properties/{propertyName}`

### Delete Item Property
`DELETE /{databaseId}/items/properties/{propertyName}`

### List Item Properties
`GET /{databaseId}/items/properties/list/`

---

## Users

### Add User
`PUT /{databaseId}/users/{userId}`

No body parameters.

### Get User Values
`GET /{databaseId}/users/{userId}`

### Set User Values
`POST /{databaseId}/users/{userId}`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `values` | object | yes | Property key-value pairs |
| `cascadeCreate` | boolean | no | Auto-create user if missing |

### Delete User
`DELETE /{databaseId}/users/{userId}`

### Merge Users
`PUT /{databaseId}/users/{targetUserId}/merge/{sourceUserId}`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `cascadeCreate` | boolean | no | Auto-create target user if missing |

### List Users
`GET /{databaseId}/users/list/`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `filter` | string (ReQL) | no | Boolean expression for filtering |
| `count` | integer | no | Number of users to return |
| `offset` | integer | no | Users to skip |
| `returnProperties` | boolean | no | Include property values in response |
| `includedProperties` | string[] | no | Specific properties to return |

---

## User Properties

### Add User Property
`PUT /{databaseId}/users/properties/{propertyName}`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | enum | yes | `int` \| `double` \| `string` \| `boolean` \| `timestamp` \| `set` |

### Get User Property Info
`GET /{databaseId}/users/properties/{propertyName}`

### Delete User Property
`DELETE /{databaseId}/users/properties/{propertyName}`

### List User Properties
`GET /{databaseId}/users/properties/list/`

---

## Recommendations

All recommendation responses return:
```json
{
  "recommId": "<UUID>",
  "recomms": [{ "id": "<itemId>", "values": {} }],
  "numberNextRecommsCalls": 0
}
```

Common optional params shared across most recommendation endpoints:

| Param | Type | Description |
|-------|------|-------------|
| `filter` | string (ReQL) | Filter recommended items |
| `booster` | string (ReQL) | Adjust relevance scores |
| `cascadeCreate` | boolean | Auto-create missing user/item |
| `scenario` | string | Recommendation scenario name |
| `logic` | string \| object | Recommendation model behavior |
| `returnProperties` | boolean | Include item property values |
| `includedProperties` | string[] | Specific properties to return |
| `reqlExpressions` | object | Compute extra properties per result |
| `expertSettings` | object | Custom model options |
| `returnAbGroup` | boolean | Return A/B test group name |

### Recommend Items to User
`POST /{databaseId}/recomms/users/{userId}/items/`

| Param | Type | Required |
|-------|------|----------|
| `count` | integer | yes |
| + common params above | | no |

### Recommend Items to Item
`POST /{databaseId}/recomms/items/{itemId}/items/`

| Param | Type | Required |
|-------|------|----------|
| `count` | integer | yes |
| `userId` | string | no (for personalization context) |
| + common params above | | no |

### Recommend Users to User (similar users)
`POST /{databaseId}/recomms/users/{userId}/users/`

| Param | Type | Required |
|-------|------|----------|
| `count` | integer | yes |
| + common params above | | no |

### Recommend Users to Item
`POST /{databaseId}/recomms/items/{itemId}/users/`

| Param | Type | Required |
|-------|------|----------|
| `count` | integer | yes |
| + common params above | | no |

### Recommend Item Segments to User
`POST /{databaseId}/recomms/users/{userId}/item-segments/`

| Param | Type | Required |
|-------|------|----------|
| `count` | integer | yes |
| `filter` | string (ReQL) | no |

### Recommend Item Segments to Item
`POST /{databaseId}/recomms/items/{itemId}/item-segments/`

| Param | Type | Required |
|-------|------|----------|
| `count` | integer | yes |

### Recommend Items to Item Segment
`POST /{databaseId}/recomms/item-segments/items/`

| Param | Type | Required |
|-------|------|----------|
| `contextSegmentId` | string | yes |
| `count` | integer | yes |
| `filter` | string (ReQL) | no |

### Recommend Next Items (pagination)
`POST /{databaseId}/recomms/next/items/{recommId}`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `count` | integer | yes | Number of next items to return |

---

## Search

The SDK `SearchItems` class is personalized search — always requires a `userId`. Supports both GET (query params) and POST (body params).

### Search Items (SearchItems)
`POST /{databaseId}/search/users/{userId}/items/`
`GET  /{databaseId}/search/users/{userId}/items/`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `searchQuery` | string | yes | Full-text search query |
| `count` | integer | yes | Number of results to return |
| `scenario` | string | no | Search scenario name |
| `cascadeCreate` | boolean | no | Create user if missing, return non-personalized results |
| `returnProperties` | boolean | no | Include item property values |
| `includedProperties` | string[] | no | Specific properties to return |
| `filter` | string (ReQL) | no | Filter search results |
| `booster` | string (ReQL) | no | Adjust result relevance scores |
| `logic` | string \| object | no | Search model behavior |
| `reqlExpressions` | object | no | Compute extra properties per result |
| `expertSettings` | object | no | Custom options |
| `returnAbGroup` | boolean | no | Return A/B test group name |

Response:
```json
{
  "recommId": "<UUID>",
  "recomms": [{ "id": "<itemId>", "values": {} }],
  "numberNextRecommsCalls": 0
}
```

Use the returned `recommId` with **Recommend Next Items** for pagination.
