import * as SQLite from 'expo-sqlite';

let databaseInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (!databaseInstance) {
    console.log("Opening new DB connection");
    databaseInstance = await SQLite.openDatabaseAsync("kayin-traficlog");
  } else {
    // Optional sanity check — make sure tables exist
    const check = await databaseInstance.getFirstAsync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='offenders'`
    );
    if (!check) {
      console.warn("DB connection might be stale — reopening");
      databaseInstance = await SQLite.openDatabaseAsync("kayin-traficlog");
    }
  }
  return databaseInstance;
}