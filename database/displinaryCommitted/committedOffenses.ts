import { getDatabase } from "../db";

export async function getCommittedOffensesByArticle(articleId: number) {
    const database = await getDatabase();
    try {
        return await database.getAllAsync(`
            SELECT committed_offenses.id, committed_offenses.name
            FROM committed_offenses
            JOIN disciplinary_committed 
            ON disciplinary_committed.committed_offenses_id = committed_offenses.id
            WHERE disciplinary_committed.disciplinary_articles_id = ?
        `, [articleId]);
    } catch (err) {
        return [];
    }
}

export async function getFineAmount(articleId: number, committedId: number) {
    const database = await getDatabase();
    try {
        const result = await database.getFirstAsync(`
            SELECT fine_amount FROM disciplinary_committed
            WHERE disciplinary_articles_id = ? AND committed_offenses_id = ?
            LIMIT 1;
        `, [articleId, committedId]) as any;

        return result?.fine_amount || null;
    } catch (err) {
        return null;
    }
}