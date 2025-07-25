import { getDatabase } from "../db";

export async function getSeizedItems() {
    const database = await getDatabase();
    try {
        const seizedItems = await database.getAllAsync(`
            SELECT * FROM seized_items;
          `)

        return seizedItems;
    } catch (err) {
        console.log(err)
    }

}

