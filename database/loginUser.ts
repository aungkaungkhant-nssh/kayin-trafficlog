import * as SecureStore from 'expo-secure-store';
import { getDatabase } from "./db";

export async function loginUser({ name, password }: { name: string, password: string }) {
    try {
        const database = await getDatabase();
        const result = await database.getFirstAsync(
            "SELECT * FROM officers WHERE name = ? AND password = ?",
            [name, password]
        ) as any;

        if (!result) return { success: false, error: "အမည် သို့မဟုတ် စကားဝှက်မှားနေသည်" };
        delete result.password;
        await SecureStore.setItemAsync('officerSession', JSON.stringify(result));
        return { success: true, user: result };
    } catch (err: any) {
        console.log(err);
        return { success: false, error: err.message };
    }
}
