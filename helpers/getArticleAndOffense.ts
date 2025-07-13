function getArticleAndOffense(value: string) {
    const cleaned = value
        .replace(/[()\[\]{}]/g, '')
        .replace(/[-‐‑‒–—―]/g, ' ') // handles all types of dashes
        .trim();

    let articleNumber = '';
    let offenseName = '';

    // Try to split using a dash or space
    const splitBySeparator = cleaned.split(/\s+/);
    if (splitBySeparator.length >= 2) {
        articleNumber = splitBySeparator[0];
        offenseName = splitBySeparator.slice(1).join(' ');
    } else {
        // If no space or dash, use regex to split Myanmar digit prefix from the text
        const match = cleaned.match(/^([၀-၉]+)(.+)$/);
        if (match) {
            articleNumber = match[1].trim();
            offenseName = match[2].trim();
        } else {
            // fallback
            return null;
        }
    }

    return {
        articleNumber,
        offenseName
    }
}

export default getArticleAndOffense;