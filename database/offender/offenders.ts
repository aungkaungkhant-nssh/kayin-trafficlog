import { getDatabase } from "../db";

export async function getOffenders() {
    const database = await getDatabase();
    try {
        const offenders = await database.getAllAsync(`
            SELECT * FROM offenders;
          `)

        return offenders;
    } catch (err) {
        console.log(err)
    }

}