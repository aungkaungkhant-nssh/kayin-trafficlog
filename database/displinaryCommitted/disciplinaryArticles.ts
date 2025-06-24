import { getDatabase } from "../db";

export async function getDisciplinaryArticles() {
    const database = await getDatabase();
    try {
        const disciplinaryArticles = await database.getAllAsync(`
            SELECT * FROM disciplinary_articles;
          `)

        return disciplinaryArticles;
    } catch (err) {
        console.log(err)
    }

}

