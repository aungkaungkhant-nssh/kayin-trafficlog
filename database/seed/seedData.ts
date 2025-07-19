import DisciplinaryCommitted from "@/constants/DiscplinaryCommitteds";
import { getDatabase } from "../db";

export async function seedData() {

  try {
    const database = await getDatabase();

    const vehicleCategories = await database.getAllAsync("select * from vehicle_categories");
    // seed vehicleCategories data
    if (!vehicleCategories.length) {
      await Promise.all(
        vehicleCategories.map(async (category) => {
          await database.execAsync(`
                      INSERT INTO vehicle_categories (name) VALUES ('${category}');
                  `);
        })
      )
    }



    const seizedItems = await database.getAllAsync("select * from seized_items");
    // seed seizedItems data
    if (!seizedItems.length) {
      await Promise.all(
        seizedItems.map(async (item) => {
          await database.execAsync(`
                      INSERT INTO seized_items (name) VALUES ('${item}');
                  `);
        })
      )
    }


    const disciplinaryArticles = await database.getAllAsync("select * from disciplinary_articles");
    const committedOffenses = await database.getAllAsync("select * from committed_offenses");
    const disciplinaryCommitted = await database.getAllAsync("select * from disciplinary_committed");

    if (!disciplinaryArticles.length && !committedOffenses.length && !disciplinaryCommitted.length) {
      // seed discplinary committed data
      for (const d of DisciplinaryCommitted) {
        // Insert into disciplinary_articles
        await database.execAsync(`
            INSERT OR IGNORE INTO disciplinary_articles (number)
            VALUES ('${d.article}');
          `);

        // Get the inserted article's id
        const articleRow = await database.getFirstAsync(`
            SELECT id FROM disciplinary_articles WHERE number = '${d.article}';
          `) as any;
        const articleId = articleRow?.id;

        for (const c of d.committed) {
          // Insert into committed_offenses
          await database.execAsync(`
              INSERT OR IGNORE INTO committed_offenses (name)
              VALUES ('${c.title}');
            `);

          // Get the offense id
          const offenseRow = await database.getFirstAsync(`
              SELECT id FROM committed_offenses WHERE name = '${c.title}';
            `) as any;
          const offenseId = offenseRow?.id;

          // Insert into disciplinary_committed
          await database.execAsync(`
              INSERT INTO disciplinary_committed (
                disciplinary_articles_id,
                committed_offenses_id,
                fine_amount
              ) VALUES (${articleId}, ${offenseId}, '${c.fineAmount}');
            `);
        }
      }
    }



    console.log("✅ Data seeded successfully.");

  } catch (err) {
    console.log(err)
  }
}