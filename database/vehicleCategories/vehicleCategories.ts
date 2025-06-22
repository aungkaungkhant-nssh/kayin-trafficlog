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

