import { getNrcStateMM } from "@/helpers/nrcStateMM";
import { toBurmeseNumber } from "@/helpers/toBurmeseNumber";
import { AddCaseSchemaType } from "@/schema/addCase.schema";
import { AddPunishmentSchemaType } from "@/schema/addPunishment.schema";
import { AddPunishmentInfoSchemaType } from "@/schema/addPunishmentInfo.schema";
import { SearchSchemaType } from "@/schema/search.schema";
import { getDatabase } from "../db";


export async function searchOffenderVehicles(data: SearchSchemaType) {
    const db = await getDatabase();

    let { name, fatherName, nrcState, nrcNumber, nrcTownShip, nrcType, vehicleNumber, vehicleLicense } = data;
    const nrcNumberMM = toBurmeseNumber(nrcNumber);
    const nationalIdNumber = `${getNrcStateMM(nrcState)}${nrcTownShip}(${nrcType})${nrcNumberMM}`;

    if (name?.startsWith('ဦး')) {
        name = name.slice(1);
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

        // Main query: Offender + Vehicle Info
        const sql = `
            SELECT
                offenders.id AS offender_id,
                offenders.name,
                offenders.father_name,
                offenders.national_id_number,
                offenders.driver_license_number,
                offenders.address,

                vehicles.id AS vehicle_id,
                vehicles.vehicle_number,
                vehicles.vehicle_license_number,
                vehicles.vehicle_types,
                vehicle_categories.name AS vehicle_category_name,

                (
                    SELECT COUNT(*)
                    FROM vehicle_seizure_records vsr
                    JOIN offender_vehicles ov_sub ON ov_sub.id = vsr.offender_vehicles
                    WHERE ov_sub.vehicle_id = vehicles.id
                ) AS seizure_count,

                offender_vehicles.id AS offender_vehicle_id

            FROM offenders
            LEFT JOIN offender_vehicles ON offender_vehicles.offender_id = offenders.id
            LEFT JOIN vehicles ON vehicles.id = offender_vehicles.vehicle_id
            LEFT JOIN vehicle_categories ON vehicle_categories.id = vehicles.vehicle_categories_id
            ${whereClause}
        `;

        const offendersWithVehicles = await db.getAllAsync(sql, params);

        if (offendersWithVehicles.length === 0) return [];

        // Extract offender_vehicle_ids to fetch seizure records
        const offenderVehicleIds = offendersWithVehicles
            .map((o: any) => o.offender_vehicle_id)
            .filter(Boolean);

        let seizureRecordsByVehicle: Record<number, any[]> = {};

        if (offenderVehicleIds.length > 0) {
            const placeholders = offenderVehicleIds.map(() => "?").join(",");

            const seizureSql = `
                SELECT
                    vehicle_seizure_records.id AS seizure_id,
                    vehicle_seizure_records.offender_vehicles AS offender_vehicle_id,
                    vehicle_seizure_records.seized_date,
                    vehicle_seizure_records.seizure_location,
                    vehicle_seizure_records.fine_paid,
                    vehicle_seizure_records.case_number,
                    vehicle_seizure_records.action_date,

                    seized_items.name AS seized_item_name,

                    disciplinary_committed.id AS disciplinary_committed_id,
                    disciplinary_committed.fine_amount,

                    disciplinary_articles.id AS article_id,
                    disciplinary_articles.number AS article_number,

                    committed_offenses.id AS offense_id,
                    committed_offenses.name AS offense_name,

                    officers.id AS officer_id,
                    officers.name AS officer_name

                FROM vehicle_seizure_records
                LEFT JOIN seized_items ON vehicle_seizure_records.seized_item = seized_items.id
                LEFT JOIN disciplinary_committed ON vehicle_seizure_records.disciplinary_committed_id = disciplinary_committed.id
                LEFT JOIN disciplinary_articles ON disciplinary_committed.disciplinary_articles_id = disciplinary_articles.id
                LEFT JOIN committed_offenses ON disciplinary_committed.committed_offenses_id = committed_offenses.id
                LEFT JOIN officers ON vehicle_seizure_records.officer_id = officers.id
                WHERE vehicle_seizure_records.offender_vehicles IN (${placeholders})
                ORDER BY vehicle_seizure_records.seized_date DESC
            `;

            const seizureRecords = await db.getAllAsync(seizureSql, offenderVehicleIds);

            // Group by offender_vehicle_id
            seizureRecordsByVehicle = seizureRecords.reduce((acc: Record<number, any[]>, record: any) => {
                if (!acc[record.offender_vehicle_id]) acc[record.offender_vehicle_id] = [];
                acc[record.offender_vehicle_id].push({
                    seizure_id: record.seizure_id,
                    seized_date: record.seized_date,
                    action_date: record.action_date,
                    seizure_location: record.seizure_location,
                    fine_paid: record.fine_paid,
                    case_number: record.case_number,
                    seizedItem_label: record.seized_item_name,
                    disciplinary_committed_id: record.disciplinary_committed_id,
                    fine_amount: record.fine_amount,
                    article_id: record.article_id,
                    article_number: record.article_number,
                    offense_id: record.offense_id,
                    offense_name: record.offense_name,
                    officer_id: record.officer_id,
                    officer_name: record.officer_name,
                }) as any;
                return acc;
            }, {} as Record<number, any[]>);
        }

        // Final merge
        const formatted = offendersWithVehicles.map((o: any) => ({
            offender_id: o.offender_id,
            name: o.name,
            father_name: o.father_name,
            national_id_number: o.national_id_number,
            driver_license_number: o.driver_license_number,
            address: o.address,
            vehicle_id: o.vehicle_id,
            vehicle_number: o.vehicle_number,
            vehicle_license_number: o.vehicle_license_number,
            vehicle_types: o.vehicle_types,
            vehicle_categories: o.vehicle_category_name,
            seizure_count: o.seizure_count || 0,
            offender_vehicle_id: o.offender_vehicle_id,
            vehicle_seizure_records: seizureRecordsByVehicle[o.offender_vehicle_id] || []
        }));

        return formatted;

    } catch (err) {
        console.error("Error in searchOffenderVehicles:", err);
        return [];
    }
}


export async function storePunishment(data: AddPunishmentInfoSchemaType, officerId: number) {
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

export async function addPunishment(data: AddPunishmentSchemaType, offenderVehicleId: number, officerId: number) {
    const db = await getDatabase();

    const {
        seized_date,
        seizure_location,
        committed_id,
        fine_amount,
        seizedItem_id,
    } = data;

    const committedIdInt = parseInt(committed_id, 10);
    const seizedItemIdInt = parseInt(seizedItem_id, 10);

    try {
        // 1. Check if offender_vehicle_id exists
        const checkResult = await db.getAllAsync(
            'SELECT id FROM offender_vehicles WHERE id = ?',
            [+offenderVehicleId]
        );

        if (checkResult.length === 0) {
            throw new Error('Invalid offender vehicle ID');
        }

        // 2. Insert into vehicle_seizure_records


        await db.runAsync(
            `INSERT INTO vehicle_seizure_records (
          offender_vehicles,
          disciplinary_committed_id,
          officer_id,
          seized_date,
          seizure_location,
          fine_paid,
          seized_item
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                offenderVehicleId,
                committedIdInt,
                officerId,
                seized_date,
                seizure_location,
                fine_amount || 0,
                seizedItemIdInt
            ]
        );

        return { success: true };
    } catch (error: any) {
        console.error('Error adding punishment:', error);
        return { success: false, message: error.message };
    }
}


export async function addCase(data: AddCaseSchemaType, seizure_id: number) {
    const db = await getDatabase();

    const {
        case_number,
        action_date,
    } = data;

    const caseNumberInt = parseInt(case_number);

    try {
        // 1. Check if offender_vehicle_id exists
        const checkResult = await db.getAllAsync(
            'SELECT id FROM vehicle_seizure_records WHERE id = ?',
            [+seizure_id]
        );

        if (checkResult.length === 0) {
            throw new Error('Invalid Seizure ID');
        }

        await db.runAsync(
            `
              UPDATE vehicle_seizure_records
              SET case_number = ?, action_date = ?, updated_at = datetime('now')
              WHERE id = ?
            `,
            [caseNumberInt, action_date, seizure_id]
        );

        return { success: true, message: 'Case updated successfully.' };


    } catch (error: any) {
        console.error('Error adding punishment:', error);
        return { success: false, message: error.message };
    }
}

export async function caseFilterWithDate(
    startDate: string,
    endDate: string,
    vehicleCategoryIdStr: string,
    limit = 20,
    offset = 0
) {
    const db = await getDatabase();

    try {
        const vehicleCategoryId = vehicleCategoryIdStr ? Number(vehicleCategoryIdStr) : '';

        const results = await db.getAllAsync(
            `
        SELECT
          vsr.*,
          ov.id AS offender_vehicle_id,
          o.name AS offender_name,
          o.father_name AS offender_father_name,
          o.national_id_number,
          o.address,
          v.vehicle_number,
          v.vehicle_license_number,
          v.vehicle_types,
          da.number AS article_number,
          co.name AS offense_name,
          of.name AS officer_name,
          si.name AS seized_item_name
        FROM vehicle_seizure_records vsr
        LEFT JOIN offender_vehicles ov ON vsr.offender_vehicles = ov.id
        LEFT JOIN offenders o ON ov.offender_id = o.id
        LEFT JOIN vehicles v ON ov.vehicle_id = v.id
        LEFT JOIN disciplinary_committed dc ON vsr.disciplinary_committed_id = dc.id
        LEFT JOIN disciplinary_articles da ON dc.disciplinary_articles_id = da.id
        LEFT JOIN committed_offenses co ON dc.committed_offenses_id = co.id
        LEFT JOIN officers of ON vsr.officer_id = of.id
        LEFT JOIN seized_items si ON vsr.seized_item = si.id
        WHERE vsr.action_date IS NOT NULL
          AND vsr.case_number IS NOT NULL
          AND vsr.action_date BETWEEN ? AND ?
          AND (? = '' OR v.vehicle_categories_id = ?)
        ORDER BY vsr.action_date DESC
        LIMIT ? OFFSET ?
        `,
            [startDate, endDate, vehicleCategoryId, vehicleCategoryId, limit, offset]
        );

        return results;
    } catch (error: any) {
        console.error('Error fetching case records:', error);
        return { success: false, message: error.message };
    }
}


export async function caseFilterWithDate2(startDate: string, endDate: string) {
    const db = await getDatabase();

    try {
        const results = await db.getAllAsync(
            `
        SELECT
          vsr.*,
          ov.id AS offender_vehicle_id,
          o.name AS offender_name,
          o.father_name AS offender_father_name,
          o.national_id_number,
          o.address,
          v.vehicle_number,
          v.vehicle_license_number,
          v.vehicle_types,
          da.number AS article_number,
          co.name AS offense_name,
          of.name AS officer_name,
          si.name AS seized_item_name
        FROM vehicle_seizure_records vsr
        LEFT JOIN offender_vehicles ov ON vsr.offender_vehicles = ov.id
        LEFT JOIN offenders o ON ov.offender_id = o.id
        LEFT JOIN vehicles v ON ov.vehicle_id = v.id
        LEFT JOIN disciplinary_committed dc ON vsr.disciplinary_committed_id = dc.id
        LEFT JOIN disciplinary_articles da ON dc.disciplinary_articles_id = da.id
        LEFT JOIN committed_offenses co ON dc.committed_offenses_id = co.id
        LEFT JOIN officers of ON vsr.officer_id = of.id
        LEFT JOIN seized_items si ON vsr.seized_item = si.id
        WHERE vsr.action_date IS NOT NULL
          AND vsr.case_number IS NOT NULL
          AND vsr.action_date BETWEEN ? AND ?
        `,
            [startDate, endDate]
        );

        return results;
    } catch (error: any) {
        console.error('Error fetching case records:', error);
        return { success: false, message: error.message };
    }
}


