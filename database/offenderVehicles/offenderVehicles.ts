import { getNrcStateMM } from "@/helpers/nrcStateMM";
import { toBurmeseNumber } from "@/helpers/toBurmeseNumber";
import { AddPunishmentSchemaType } from "@/schema/addPunishment.schema";
import { SearchSchemaType } from "@/schema/search.schema";
import { getDatabase } from "../db";


export async function searchOffenderVehicles(data: SearchSchemaType) {

    const db = await getDatabase();

    const { name, fatherName, nrcState, nrcNumber, nrcTownShip, nrcType, vehicleNumber, vehicleLicense } = data;
    const nrcNumberMM = toBurmeseNumber(nrcNumber);
    const nationalIdNumber = `${getNrcStateMM(nrcState)}${nrcTownShip}(${nrcType})${nrcNumberMM}`;
    console.log(nationalIdNumber)
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
          vehicle_seizure_records.id AS seizure_id,
          vehicle_seizure_records.seized_date,
          vehicle_seizure_records.seizure_location,
          vehicle_seizure_records.fine_paid,
          vehicle_seizure_records.case_number,
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
} // Adjust path

export async function storePunishment(data: AddPunishmentSchemaType, officerId: number,) {
    const db = await getDatabase();

    try {
        await db.execAsync("BEGIN TRANSACTION");

        // Destructure required fields from data
        const {
            name,
            father_name,
            nrcState,
            nrcTownShip,
            nrcType,
            nrcNumber,
            driver_license_number,
            address,
            vehicle_number,
            vehicle_categories_id,
            vehicle_types,
            wheel_tax,
            vehicle_license_number,
            committed_id,
            seized_date,
            seizure_location,
            fine_amount,
            seizedItem_id
        } = data;

        const nrcNumberMM = toBurmeseNumber(nrcNumber);
        const nationalIdNumber = `${getNrcStateMM(nrcState)}${nrcTownShip}(${nrcType})${nrcNumberMM}`;

        // Insert into offenders
        await db.runAsync(
            `INSERT INTO offenders (name, father_name, national_id_number, driver_license_number, address) VALUES (?, ?, ?, ?, ?)`,
            [name, father_name, nationalIdNumber, driver_license_number ?? null, address ?? null]
        );
        const { id: offenderId } = (await db.getFirstAsync(`SELECT last_insert_rowid() as id`)) as any;

        // Insert into vehicles
        await db.runAsync(
            `INSERT INTO vehicles (vehicle_number, vehicle_categories_id, vehicle_types, wheel_tax, vehicle_license_number) VALUES (?, ?, ?, ?, ?)`,
            [vehicle_number, vehicle_categories_id, vehicle_types, wheel_tax ?? null, vehicle_license_number ?? null]
        );
        const { id: vehicleId } = (await db.getFirstAsync(`SELECT last_insert_rowid() as id`)) as any;

        // Insert into offender_vehicles
        await db.runAsync(
            `INSERT INTO offender_vehicles (offender_id, vehicle_id) VALUES (?, ?)`,
            [offenderId, vehicleId]
        );
        const { id: offenderVehicleId } = (await db.getFirstAsync(`SELECT last_insert_rowid() as id`)) as any;

        // Insert into vehicle_seizure_Records
        await db.runAsync(
            `INSERT INTO vehicle_seizure_records (
                offender_vehicles, disciplinary_commited_id, officer_id, seized_date, 
                seizure_location, fine_paid, action_date, case_number, seized_item
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                offenderVehicleId,
                committed_id,
                officerId,
                seized_date,
                seizure_location,
                fine_amount ?? 0,
                null,
                null,
                seizedItem_id
            ]
        );
        const { id: seizureRecordId } = (await db.getFirstAsync(`SELECT last_insert_rowid() as id`)) as any;

        await db.execAsync("COMMIT");

        return {
            success: true,
            offenderId,
            vehicleId,
            offenderVehicleId,
            seizureRecordId
        };

    } catch (err) {
        console.error("Error in addPunishment:", err);
        await db.execAsync("ROLLBACK");
        return { success: false, error: err };
    }
}
