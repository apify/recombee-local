import crypto from 'crypto';

export function getRandomRecommendations(items, count, excludeItemId = null) {
    const available = Object.keys(items).filter(id => id !== excludeItemId);
    const shuffled = available.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return {
        recommId: crypto.randomUUID(),
        recomms: selected.map(id => ({
            id,
            values: items[id] || {},
        })),
    };
}

// Matches production: the Segmentation is configured on the use-case taxonomy (depth 1 and 2),
// synced onto items as useCase1Categories/useCase2Categories. Falls back to the legacy `categories`
// field only if a store has no use-case taxonomy data at all (e.g. an older local dataset).
const USE_CASE_CATEGORY_PROPERTIES = ['useCase1Categories', 'useCase2Categories'];
const LEGACY_CATEGORY_PROPERTY = 'categories';

function getCategoryProperties(items) {
    const hasUseCaseCategories = Object.values(items).some((values) =>
        USE_CASE_CATEGORY_PROPERTIES.some((property) => Array.isArray(values[property]) && values[property].length > 0),
    );
    return hasUseCaseCategories ? USE_CASE_CATEGORY_PROPERTIES : [LEGACY_CATEGORY_PROPERTY];
}

function getItemCategoryValues(values, properties) {
    return properties.flatMap((property) => (Array.isArray(values[property]) ? values[property] : []));
}

export function getUniqueCategories(items) {
    const properties = getCategoryProperties(items);
    const categories = new Set();
    for (const values of Object.values(items)) {
        for (const category of getItemCategoryValues(values, properties)) {
            categories.add(category);
        }
    }
    return [...categories];
}

export function getRandomItemSegments(items, count) {
    const shuffled = getUniqueCategories(items).sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return {
        recommId: crypto.randomUUID(),
        recomms: selected.map(id => ({ id })),
    };
}

export function getItemsForSegment(items, segmentId, count) {
    const properties = getCategoryProperties(items);
    const matchingIds = Object.keys(items).filter(id => getItemCategoryValues(items[id], properties).includes(segmentId));
    const pool = matchingIds.length > 0 ? matchingIds : Object.keys(items);
    const poolItems = Object.fromEntries(pool.map(id => [id, items[id]]));

    return getRandomRecommendations(poolItems, count);
}
