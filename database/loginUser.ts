import { getDatabase } from "./db";


export async function loginUser({ name, password }: { name: string, password: string }) {
    try {
        const database = await getDatabase();
        const result = await database.getFirstAsync(
            "SELECT * FROM officers WHERE name = ? AND password = ?",
            [name, password]
        );

        if (!result) return { success: false, error: "Invalid name or password" };
        return { success: true, user: result };
    } catch (err: any) {
        console.log(err);
        return { success: false, error: err.message };
    }
}
