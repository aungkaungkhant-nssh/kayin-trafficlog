import users from "@/constants/users";
import { getDatabase } from "../db";


export async function seedUser() {
    try {

        const database = await getDatabase();
        const officers = await database.getAllAsync("select * from officers");

        if (officers.length > 0) return;
        await Promise.all(users.map(async (user) => {
            await database.runAsync(`
                INSERT INTO officers (name,user_name, password) VALUES (?,?,?)
                `,
                [user.name, user.user_name, user.password]
            );
        }))


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
