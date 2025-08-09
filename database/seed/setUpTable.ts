import * as SecureStore from 'expo-secure-store';
import { getDatabase } from "../db";

export async function setUpTable() {
  const isInitialized = await SecureStore.getItemAsync('DB_INITIALIZED');
  if (isInitialized === 'true') {
    return;
  }
  try {
    const database = await getDatabase();

    await database.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS officers (
                    id INTEGER PRIMARY KEY NOT NULL,  
                    name TEXT NOT NULL,
                    user_name TEXT NOT NULL,
                    password TEXT NOT NULL,
                    created_at TEXT,
                    updated_at TEXT
            );
        `);


    // 1. disciplinary_articles
    await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS disciplinary_articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number TEXT UNIQUE NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
          );
        `);

    // // 2. committed_offenses
    await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS committed_offenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
          );
        `);

    // // 3. disciplinary_committed
    await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS disciplinary_committed (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disciplinary_articles_id INTEGER NOT NULL,
            committed_offenses_id INTEGER NOT NULL,
            fine_amount REAL NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (disciplinary_articles_id) REFERENCES disciplinary_articles(id),
            FOREIGN KEY (committed_offenses_id) REFERENCES committed_offenses(id)
          );
        `);

    // 4. offenders
    await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS offenders (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            father_name TEXT NOT NULL,
            national_id_number TEXT,
            driver_license_number TEXT,
            address TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
          );
        `);

    // // 5. vehicleCategories
    await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS vehicle_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
          );
        `);

    // // 6. vehicles
    await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY,
            vehicle_number INTEGER NOT NULL,
            vehicle_categories_id INTEGER NOT NULL,
            vehicle_types TEXT NOT NULL,
            wheel_tax TEXT,
            vehicle_license_number TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (vehicle_categories_id) REFERENCES vehicle_categories(id)
          );
        `);

    // // 7. offenderVehicles
    await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS offender_vehicles (
            id INTEGER PRIMARY KEY,
            offender_id INTEGER NOT NULL,
            vehicle_id INTEGER NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (offender_id) REFERENCES offenders(id),
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
          );
        `);

    // // 8. seizedItems
    await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS seized_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
          );
        `);


    // // 10. vehicleSeizureRecords
    await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS vehicle_seizure_records (
            id INTEGER PRIMARY KEY,
            offender_vehicles INTEGER NOT NULL,
            disciplinary_committed_id INTEGER NOT NULL,
            officer_id INTEGER NOT NULL,
            seized_date TEXT NOT NULL,
            seizure_location TEXT NOT NULL,
            fine_amount REAL NOT NULL,
            action_date TEXT,
            case_number INTEGER,
            seized_item INTEGER NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (offender_vehicles) REFERENCES offender_vehicles(id),
            FOREIGN KEY (disciplinary_committed_id) REFERENCES disciplinary_committed(id),
            FOREIGN KEY (officer_id) REFERENCES officers(id),
            FOREIGN KEY (seized_item) REFERENCES seized_items(id)
          );
        `);

    await database.execAsync("PRAGMA journal_mode = WAL;");
    await database.getFirstAsync("SELECT 1");

    await SecureStore.setItemAsync('DB_INITIALIZED', "true");
    console.log("✅ All tables created successfully.");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  }
}