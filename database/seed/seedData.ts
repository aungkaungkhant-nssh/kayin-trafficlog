import DisciplinaryCommitted from "@/constants/DiscplinaryCommitteds";
import seizedItems from "@/constants/SeizedItems";
import vehicleCategoriesData from "@/constants/VehicleCategories";
import { getDatabase } from "../db";

function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''");
}

export async function seedData() {
  try {
    const database = await getDatabase();

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

  } catch (err) {
    console.log(err);
  }
}
