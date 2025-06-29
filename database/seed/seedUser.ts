import { getDatabase } from "../db";


export async function seedUser() {
    const name = process.env.EXPO_PUBLIC_SEED_NAME;
    const user_name = process.env.EXPO_PUBLIC_SEED_USER_NAME;
    const password = process.env.EXPO_PUBLIC_SEED_PASSWORD;
    try {
        const database = await getDatabase();
        await database.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS 
            officers (
                        id INTEGER PRIMARY KEY NOT NULL,  
                        name TEXT NOT NULL,
                        user_name TEXT NOT NULL,
                        password TEXT NOT NULL,
                        created_at TEXT,
                        updated_at TEXT
                    );
            INSERT INTO officers (name,user_name, password) VALUES ('${name}','${user_name}','${password}');
            `);
        console.log("Ok")
    } catch (err) {
        console.log(err)
    }
}


export async function getSeedUser() {
    try {
        const database = await getDatabase();
        const result = await database.getAllAsync("SELECT * FROM officers");
        return result
    } catch (error) {
        console.log(error)
    }
}

export async function deleteUser(id: number) {
    try {
        const database = await getDatabase();
        const result = await database.runAsync("DELETE FROM officers WHERE id = $id", { $id: id });
        return result;
    } catch (error) {
        console.log(error);
    }
}
