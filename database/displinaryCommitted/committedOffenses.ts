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
        console.log(err);
        return [];
    }
}