import DisciplinaryCommitted from '@/constants/DiscplinaryCommitteds';
import seizedItems from '@/constants/SeizedItems';
import users from '@/constants/users';
import vehicleCategoriesData from '@/constants/VehicleCategories';
import * as SecureStore from 'expo-secure-store';
import { getDatabase } from "../db";
function escapeSqlString(str: string): string {
    return str.replace(/'/g, "''");
}


export async function loginOfficer({ user_name, password }: { user_name: string, password: string }) {
    try {
        const database = await getDatabase();
        const officers = await database.getAllAsync("SELECT * FROM officers");

        if (officers.length === 0) {
            await Promise.all(users.map(async (user) => {
                await database.runAsync(`
                    INSERT INTO officers (name,user_name, password) VALUES (?,?,?)
                    `,
                    [user.name, user.user_name, user.password]
                );
            }))
        }

        // 1) vehicle_categories
        const vehicleCategories = await database.getAllAsync("select * from vehicle_categories");
        if (vehicleCategories.length === 0) {
            for (const category of vehicleCategoriesData) {
                await database.execAsync(`
          INSERT INTO vehicle_categories (name) VALUES ('${escapeSqlString(category)}');
        `);
            }
        }

        // 2) seized_items
        const seizedItemsData = await database.getAllAsync("select * from seized_items");
        if (seizedItemsData.length === 0) {
            for (const item of seizedItems) {
                await database.execAsync(`
          INSERT INTO seized_items (name) VALUES ('${escapeSqlString(item)}');
        `);
            }
        }

        // 3) disciplinary data
        const disciplinaryArticles = await database.getAllAsync("select * from disciplinary_articles");
        const committedOffenses = await database.getAllAsync("select * from committed_offenses");
        const disciplinaryCommitted = await database.getAllAsync("select * from disciplinary_committed");

        if (disciplinaryArticles.length === 0 && committedOffenses.length === 0 && disciplinaryCommitted.length === 0) {
            for (const d of DisciplinaryCommitted) {
                await database.execAsync(`
          INSERT OR IGNORE INTO disciplinary_articles (number) VALUES ('${escapeSqlString(d.article)}');
        `);

                const articleRow = await database.getFirstAsync(`
          SELECT id FROM disciplinary_articles WHERE number = '${escapeSqlString(d.article)}';
        `) as any;
                const articleId = articleRow?.id;

                for (const c of d.committed) {
                    await database.execAsync(`
            INSERT OR IGNORE INTO committed_offenses (name) VALUES ('${escapeSqlString(c.title)}');
          `);

                    const offenseRow = await database.getFirstAsync(`
            SELECT id FROM committed_offenses WHERE name = '${escapeSqlString(c.title)}';
          `) as any;
                    const offenseId = offenseRow?.id;

                    if (articleId && offenseId) {
                        await database.execAsync(`
              INSERT INTO disciplinary_committed (
                disciplinary_articles_id,
                committed_offenses_id,
                fine_amount
              ) VALUES (${articleId}, ${offenseId}, '${escapeSqlString(String(c.fineAmount))}');
            `);
                    }
                }
            }
        }

        const result = await database.getFirstAsync(
            "SELECT * FROM officers WHERE user_name = ? AND password = ?",
            [user_name, password]
        ) as any;

        if (!result) return { success: false, error: "အမည် သို့မဟုတ် စကားဝှက်မှားနေသည်" };
        delete result.password;
        return { success: true, user: result };
    } catch (err: any) {
        console.log(err);
        return { success: false, error: err.message };
    }
}

export async function changePassword({ oldPassword, newPassword, userName, officerId, name }: { oldPassword: string, newPassword: string, officerId: number, userName: string, name: string }) {
    try {
        const db = await getDatabase();

        // Check if we need to verify old password
        if (oldPassword && newPassword) {
            const existingOfficer = await db.getFirstAsync<{ password: string }>(
                `SELECT password FROM officers WHERE id = ?`,
                [officerId]
            );

            if (!existingOfficer) {
                return { success: false, error: "Officer not found" };
            }

            if (existingOfficer.password !== oldPassword) {
                return { success: false, error: "စကားဝှက်ဟောင်းမှားနေသည်" };
            }
        }

        // Build dynamic update fields
        const updateFields: string[] = [];
        const params: any[] = [];

        if (newPassword) {
            updateFields.push("password = ?");
            params.push(newPassword);
        }

        if (userName) {
            updateFields.push("user_name = ?");
            params.push(userName);
        }

        if (userName) {
            updateFields.push("name = ?");
            params.push(name);
        }

        updateFields.push("updated_at = datetime('now')");

        // Run update if there’s something to change
        if (updateFields.length > 1) {
            params.push(officerId);
            await db.runAsync(
                `UPDATE officers SET ${updateFields.join(", ")} WHERE id = ?`,
                params
            );
        }

        return { success: true };
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