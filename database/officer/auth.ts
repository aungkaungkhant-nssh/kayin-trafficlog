import * as SecureStore from 'expo-secure-store';
import { getDatabase } from "../db";

export async function loginOfficer({ user_name, password }: { user_name: string, password: string }) {
    try {
        const database = await getDatabase();
        const result = await database.getFirstAsync(
            "SELECT * FROM officers WHERE user_name = ? AND password = ?",
            [user_name, password]
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


export async function logoutOfficer() {
    try {
        await SecureStore.deleteItemAsync('officerSession');
        return { success: true };
    } catch (err: any) {
        console.log('Logout error:', err);
        return { success: false, error: err.message };
    }
}