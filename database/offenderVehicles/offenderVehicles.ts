import { getNrcStateMM } from "@/helpers/nrcStateMM";
import { toBurmeseNumber } from "@/helpers/toBurmeseNumber";
import { AddPunishmentSchemaType } from "@/schema/addPunishment.schema";
import { SearchSchemaType } from "@/schema/search.schema";
import { getDatabase } from "../db";


export async function searchOffenderVehicles(data: SearchSchemaType) {

    const db = await getDatabase();

    let { name, fatherName, nrcState, nrcNumber, nrcTownShip, nrcType, vehicleNumber, vehicleLicense } = data;
    const nrcNumberMM = toBurmeseNumber(nrcNumber);
    const nationalIdNumber = `${getNrcStateMM(nrcState)}${nrcTownShip}(${nrcType})${nrcNumberMM}`;
    if (name?.startsWith('ဦး')) {
        name = name.slice(1); // Remove first character
    }
   
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
        LEFT JOIN vehicle_seizure_records ON vehicle_seizure_records.offender_vehicles = offender_vehicles.id
        LEFT JOIN seized_items ON vehicle_seizure_records.seized_item = seized_items.id
        ${whereClause}
      `;

        const results = await db.getAllAsync(sql, params);
        return results;
    } catch (err) {
        console.error("Error in searchOffenderVehicles:", err);
        return [];
    }
} // Adjust path

export async function storePunishment(data: AddPunishmentSchemaType, officerId: number) {
    const db = await getDatabase();

    try {
        await db.execAsync("PRAGMA foreign_keys = ON;");
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
            seizedItem_id,
        } = data;

        // Parse and validate all foreign key IDs
        const committedIdInt = parseInt(committed_id, 10);
        const seizedItemIdInt = parseInt(seizedItem_id, 10);
        const vehicleCategoriesInt = parseInt(vehicle_categories_id, 10);

        if (
            isNaN(committedIdInt) ||
            isNaN(seizedItemIdInt) ||
            isNaN(vehicleCategoriesInt)
        ) {
            throw new Error(
                "Invalid committed_id, seizedItem_id, or vehicle_categories_id. They must be valid numbers."
            );
        }

        // Validate foreign key existence
        const committedRow = await db.getFirstAsync(
            `SELECT id FROM disciplinary_committed WHERE id = ?`,
            [committedIdInt]
        );
        if (!committedRow) {
            throw new Error(`committed_id ${committedIdInt} does not exist.`);
        }

        const seizedItemRow = await db.getFirstAsync(
            `SELECT id FROM seized_items WHERE id = ?`,
            [seizedItemIdInt]
        );
        if (!seizedItemRow) {
            throw new Error(`seizedItem_id ${seizedItemIdInt} does not exist.`);
        }

        const vehicleCategoryRow = await db.getFirstAsync(
            `SELECT id FROM vehicle_categories WHERE id = ?`,
            [vehicleCategoriesInt]
        );
        if (!vehicleCategoryRow) {
            throw new Error(`vehicle_categories_id ${vehicleCategoriesInt} does not exist.`);
        }

        // Construct NRC Burmese formatted number
        const nrcNumberMM = toBurmeseNumber(nrcNumber);
        const nationalIdNumber = `${getNrcStateMM(nrcState)}${nrcTownShip}(${nrcType})${nrcNumberMM}`;

        // Insert offender
        await db.runAsync(
            `INSERT INTO offenders (name, father_name, national_id_number, driver_license_number, address) VALUES (?, ?, ?, ?, ?)`,
            [name, father_name, nationalIdNumber, driver_license_number ?? null, address ?? null]
        );
        const { id: offenderId } = (await db.getFirstAsync(
            `SELECT last_insert_rowid() as id`
        )) as any;
        if (!offenderId) throw new Error("Failed to insert offender.");

        // Insert vehicle
        await db.runAsync(
            `INSERT INTO vehicles (vehicle_number, vehicle_categories_id, vehicle_types, wheel_tax, vehicle_license_number) VALUES (?, ?, ?, ?, ?)`,
            [
                vehicle_number,
                vehicleCategoriesInt,
                vehicle_types,
                wheel_tax ?? null,
                vehicle_license_number ?? null,
            ]
        );
        const { id: vehicleId } = (await db.getFirstAsync(
            `SELECT last_insert_rowid() as id`
        )) as any;
        if (!vehicleId) throw new Error("Failed to insert vehicle.");

        // Insert offender_vehicle link
        await db.runAsync(
            `INSERT INTO offender_vehicles (offender_id, vehicle_id) VALUES (?, ?)`,
            [offenderId, vehicleId]
        );
        const { id: offenderVehicleId } = (await db.getFirstAsync(
            `SELECT last_insert_rowid() as id`
        )) as any;
        if (!offenderVehicleId) throw new Error("Failed to insert offender_vehicle.");

        // Insert vehicle seizure record
        await db.runAsync(
            `INSERT INTO vehicle_seizure_records (
          offender_vehicles, disciplinary_committed_id, officer_id, seized_date,
          seizure_location, fine_paid, action_date, case_number, seized_item
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                offenderVehicleId,
                committedIdInt,
                officerId,
                seized_date,
                seizure_location,
                fine_amount ? parseFloat(fine_amount.toString()) : 0,
                null,
                null,
                seizedItemIdInt,
            ]
        );

        const { id: seizureRecordId } = (await db.getFirstAsync(
            `SELECT last_insert_rowid() as id`
        )) as any;
        if (!seizureRecordId) throw new Error("Failed to insert vehicle_seizure_record.");
        console.log('work')

        return {
            success: true,
            offenderId,
            vehicleId,
            offenderVehicleId,
            seizureRecordId,
        };
    } catch (err) {
        console.error("Error in storePunishment:", err);
        return { success: false, error: err instanceof Error ? err.message : err };
    }
}

