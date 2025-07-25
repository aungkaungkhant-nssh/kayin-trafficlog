import { getDatabase } from "../db";

export async function getVehicleCategories() {
    const database = await getDatabase();
    try {
        const vehicleCategories = await database.getAllAsync(`
            SELECT * FROM vehicle_categories;
          `)

        return vehicleCategories;
    } catch (err) {
        console.log(err)
    }

}

export async function getVehicleCategoryById(id: number) {
    const database = await getDatabase();
    try {
        const vehicleCategory = await database.getFirstAsync(`
            SELECT * FROM vehicle_categories WHERE id = ?;
        `, [id]);

        return vehicleCategory;
    } catch (err) {
        console.log(err);

    }
}
