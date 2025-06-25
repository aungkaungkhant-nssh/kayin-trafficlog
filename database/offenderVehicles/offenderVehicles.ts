import { getDatabase } from "../db";

export async function searchOffenderVehicles({
    name,
    fatherName,
    nationalIdNumber,
    vehicleNumber,
    vehicleLicense,
}: {
    name?: string;
    fatherName?: string;
    nationalIdNumber?: string;
    vehicleNumber?: string;
    vehicleLicense?: string;
}) {

    const db = await getDatabase();

    try {
        const searchFields = [
            { input: name, column: "offenders.name" },
            { input: fatherName, column: "offenders.father_name" },
            { input: nationalIdNumber, column: "offenders.national_id_number" },
            { input: vehicleNumber, column: "vehicles.vehicle_number" },
            { input: vehicleLicense, column: "vehicles.vehicle_license_number" },
        ];

        const conditions: string[] = [];
        const params: any[] = [];

        searchFields.forEach(({ input, column }) => {
            if (input && input.trim() !== "") {
                conditions.push(`${column} LIKE ?`);
                params.push(`%${input.trim()}%`);
            }
        });

        const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" OR ") : "";

        const sql = `
        SELECT
          offenders.id AS offender_id,
          offenders.name AS offender_name,
          offenders.father_name,
          offenders.national_id_number,
          offenders.driver_license_number,
          vehicles.id AS vehicle_id,
          vehicles.vehicle_number,
          vehicles.vehicle_license_number,
          vehicle_seizure_Records.id AS seizure_id,
          vehicle_seizure_Records.seized_date,
          vehicle_seizure_Records.seizure_location,
          vehicle_seizure_Records.fine_paid,
          vehicle_seizure_Records.caseNumber,
          seized_items.name AS seized_item_name
        FROM offenders
        LEFT JOIN offender_vehicles ON offender_vehicles.offender_id = offenders.id
        LEFT JOIN vehicles ON vehicles.id = offender_vehicles.vehicle_id
        LEFT JOIN vehicle_seizure_Records ON vehicle_seizure_Records.offender_vehicles = offender_vehicles.id
        LEFT JOIN seized_items ON vehicle_seizure_Records.seized_item = seized_items.id
        ${whereClause}
      `;

        const results = await db.getAllAsync(sql, params);
        return results;
    } catch (err) {
        console.error("Error in searchOffenderVehicles:", err);
        return [];
    }
}
