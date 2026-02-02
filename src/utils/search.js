import crypto from 'crypto';

export function searchItems(items, query, count) {
    const queryLower = query.toLowerCase();
    const matches = [];

    for (const [id, values] of Object.entries(items)) {
        const score = calculateMatchScore(id, values, queryLower);
        if (score > 0) {
            matches.push({ id, values, score });
        }
    }

    // Sort by score descending, then by id for stable ordering
    matches.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

    return {
        recommId: crypto.randomUUID(),
        recomms: matches.slice(0, count).map(({ id, values }) => ({ id, values })),
    };
}

function calculateMatchScore(id, values, queryLower) {
    let score = 0;

    // Check item ID
    if (id.toLowerCase().includes(queryLower)) {
        score += 10;
    }

    // Check all string property values
    for (const value of Object.values(values)) {
        if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
            score += 5;
        }
    }

    return score;
}
