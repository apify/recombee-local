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

export function getUniqueCategories(items) {
    const categories = new Set();
    for (const values of Object.values(items)) {
        if (Array.isArray(values.categories)) {
            for (const category of values.categories) {
                categories.add(category);
            }
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
    const matchingIds = Object.keys(items).filter(id => Array.isArray(items[id].categories) && items[id].categories.includes(segmentId));
    const pool = matchingIds.length > 0 ? matchingIds : Object.keys(items);
    const poolItems = Object.fromEntries(pool.map(id => [id, items[id]]));

    return getRandomRecommendations(poolItems, count);
}
