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
