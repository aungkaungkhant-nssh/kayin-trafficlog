import * as SQLite from 'expo-sqlite';

let databaseInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
    if (databaseInstance) return databaseInstance;
    databaseInstance = await SQLite.openDatabaseAsync("kayin-traficlog");
    return databaseInstance;
}
