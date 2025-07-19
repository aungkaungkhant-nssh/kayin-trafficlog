import getArticleAndOffense from "@/helpers/getArticleAndOffense";
import getNormalizedValue from "@/helpers/normalize";
import { getNrcStateMM } from "@/helpers/nrcStateMM";
import sanitize from "@/helpers/sanitize";
import { toBurmeseNumber } from "@/helpers/toBurmeseNumber";
import { AddCaseSchemaType } from "@/schema/addCase.schema";
import { AddPunishmentSchemaType } from "@/schema/addPunishment.schema";
import { AddPunishmentInfoSchemaType } from "@/schema/addPunishmentInfo.schema";
import { SearchSchemaType } from "@/schema/search.schema";
import { ExportTypeEnum } from "@/utils/enum/ExportType";
import { ImportEnum } from "@/utils/enum/ImportEnum";
import { getDatabase } from "../db";


export async function searchOffenderVehicles(data: SearchSchemaType) {
    const db = await getDatabase();
    let { name, fatherName, nrcState, nrcNumber, nrcTownShip, nrcType, vehicleNumber, vehicleLicense } = data;
    const nrcNumberMM = toBurmeseNumber(nrcNumber);
    const nationalIdNumber = `${getNrcStateMM(nrcState)}${nrcTownShip}(${nrcType})${nrcNumberMM}`;

    // Strip ZWNJ, ZWJ, BOM from input
    const sanitize = (str: string) =>
        str.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();

    const normalizedName = sanitize(name ?? "");
    const nameVariants =
        normalizedName.startsWith("ဦး") && normalizedName.length > 1
            ? [normalizedName, sanitize(normalizedName.slice(1))]
            : [normalizedName];

    const conditions: string[] = [];
    const params: any[] = [];

    // const r = await db.runAsync("DELETE FROM offenders WHERE id=5");
    // await db.execAsync("PRAGMA foreign_keys = ON;");

    // await db.runAsync("DELETE FROM vehicles WHERE  id= 1752901158950");
    // await db.runAsync("DELETE FROM offenders WHERE id = 14");
    try {
        // Handle name variants specially
        if (normalizedName) {
            nameVariants.forEach((variant) => {
                conditions.push(`
                    REPLACE(REPLACE(REPLACE(offenders.name, char(8204), ''), char(8205), ''), char(65279), '') LIKE ?
                `);
                params.push(`%${variant}%`);
            });
        }

        // Other fields
        const searchFields = [
            { input: fatherName, column: "offenders.father_name" },
            { input: nationalIdNumber, column: "offenders.national_id_number" },
            { input: vehicleNumber, column: "vehicles.vehicle_number" },
            { input: vehicleLicense, column: "vehicles.vehicle_license_number" },
        ];

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
                vehicle_categories.id AS vehicle_category_id,

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
                });
                return acc;
            }, {});
        }

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
            vehicle_categories_id: o.vehicle_category_id,
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

        // Utility to remove all space characters from strings

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

        const committedIdInt = parseInt(committed_id, 10);
        const seizedItemIdInt = parseInt(seizedItem_id, 10);
        const vehicleCategoriesInt = parseInt(vehicle_categories_id, 10);

        // id generate
        const baseId = Date.now();
        const newVehicleId = baseId + 1;
        const newOffenderVehicleId = baseId + 2;
        const newSeizureRecordId = baseId + 3;

        if (
            isNaN(committedIdInt) ||
            isNaN(seizedItemIdInt) ||
            isNaN(vehicleCategoriesInt)
        ) {
            throw new Error("Invalid committed_id, seizedItem_id, or vehicle_categories_id. They must be valid numbers.");
        }


        const committedRow = await db.getFirstAsync(
            `SELECT id FROM disciplinary_committed WHERE id = ?`,
            [committedIdInt]
        );
        if (!committedRow) throw new Error(`committed_id ${committedIdInt} does not exist.`);


        const seizedItemRow = await db.getFirstAsync(
            `SELECT id FROM seized_items WHERE id = ?`,
            [seizedItemIdInt]
        );
        if (!seizedItemRow) throw new Error(`seizedItem_id ${seizedItemIdInt} does not exist.`);

        const vehicleCategoryRow = await db.getFirstAsync(
            `SELECT id FROM vehicle_categories WHERE id = ?`,
            [vehicleCategoriesInt]
        );
        if (!vehicleCategoryRow) throw new Error(`vehicle_categories_id ${vehicleCategoriesInt} does not exist.`);

        // Construct NRC Burmese formatted number
        const nrcNumberMM = toBurmeseNumber(nrcNumber);
        let nationalIdNumber = "";
        if (nrcState && nrcTownShip && nrcType && nrcNumberMM) {
            nationalIdNumber = `${getNrcStateMM(nrcState)}${sanitize(nrcTownShip)}(${sanitize(nrcType)})${nrcNumberMM}`;
        }

        // Insert offender
        await db.runAsync(
            `INSERT INTO offenders (id, name, father_name, national_id_number, driver_license_number, address) VALUES (?,?, ?, ?, ?, ?)`,
            [
                baseId,
                sanitize(name),
                sanitize(father_name),
                sanitize(nationalIdNumber),
                sanitize(driver_license_number),
                sanitize(address),
            ]
        );

        const { id: offenderId } = (await db.getFirstAsync(
            `SELECT last_insert_rowid() as id`
        )) as any;
        if (!offenderId) throw new Error("Failed to insert offender.");

        // Insert vehicle
        await db.runAsync(
            `INSERT INTO vehicles (id,vehicle_number, vehicle_categories_id, vehicle_types, wheel_tax, vehicle_license_number) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                newVehicleId,
                sanitize(vehicle_number),
                vehicleCategoriesInt,
                sanitize(vehicle_types),
                wheel_tax ?? null,
                sanitize(vehicle_license_number),
            ]
        );
        const { id: vehicleId } = (await db.getFirstAsync(
            `SELECT last_insert_rowid() as id`
        )) as any;
        if (!vehicleId) throw new Error("Failed to insert vehicle.");

        // Link offender and vehicle
        await db.runAsync(
            `INSERT INTO offender_vehicles (id,offender_id, vehicle_id) VALUES (?, ?, ?)`,
            [newOffenderVehicleId, offenderId, vehicleId]
        );
        const { id: offenderVehicleId } = (await db.getFirstAsync(
            `SELECT last_insert_rowid() as id`
        )) as any;
        if (!offenderVehicleId) throw new Error("Failed to insert offender_vehicle.");

        // Insert vehicle seizure record
        await db.runAsync(
            `INSERT INTO vehicle_seizure_records (
                id,
                offender_vehicles, disciplinary_committed_id, officer_id, seized_date,
                seizure_location, fine_paid, action_date, case_number, seized_item
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                newSeizureRecordId,
                offenderVehicleId,
                committedIdInt,
                officerId,
                seized_date,
                sanitize(seizure_location),
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


export async function addPunishment(data: AddPunishmentSchemaType, item: any, officerId: number) {
    const db = await getDatabase();
    let offenderVehicleId = item.offender_vehicle_id;

    const {
        seized_date,
        seizure_location,
        committed_id,
        fine_amount,
        seizedItem_id,
    } = data;

    const committedIdInt = parseInt(committed_id, 10);
    const seizedItemIdInt = parseInt(seizedItem_id, 10);

    //id generate
    const baseId = Date.now();
    const newVehicleId = baseId + 1;
    const newOffenderVehicleId = baseId + 2;
    const newSeizureRecordId = baseId + 3;

    try {
        // 1. Check if offender_vehicle_id exists
        const checkResult = await db.getAllAsync(
            'SELECT id FROM offender_vehicles WHERE id = ?',
            [+offenderVehicleId]
        );

        if (checkResult.length === 0) {
            throw new Error('Invalid offender vehicle ID');
        }


        // check new vehicle or current vehicle
        const vehicleCategoryId = Number(data.vehicle_categories_id);
        if (
            (item.vehicle_number !== data.vehicle_number ||
                item.vehicle_types !== data.vehicle_types ||
                item.vehicle_categories_id !== vehicleCategoryId) &&
            data.vehicle_number &&
            data.vehicle_types &&
            vehicleCategoryId
        ) {

            await db.runAsync(
                `
                INSERT INTO vehicles (
                    id,
                    vehicle_number,
                    vehicle_categories_id,
                    vehicle_types,
                    wheel_tax,
                    vehicle_license_number,
                    created_at,
                    updated_at
                ) VALUES (?,?, ?, ?, ?, ?, datetime('now'), datetime('now'))
                `,
                [
                    newVehicleId,
                    data.vehicle_number,
                    vehicleCategoryId,
                    data.vehicle_types,
                    null, // assuming optional
                    null
                ]
            );

            const offenderId = item.offender_id;

            await db.runAsync(
                `INSERT INTO offender_vehicles (id, offender_id, vehicle_id) VALUES (?, ?, ?)`,
                [newOffenderVehicleId, offenderId, newVehicleId]
            );

            const { id } = (await db.getFirstAsync(
                `SELECT last_insert_rowid() as id`
            )) as any;
            offenderVehicleId = id;

        }


        // 2. Insert into vehicle_seizure_records
        await db.runAsync(
            `INSERT INTO vehicle_seizure_records (
          id,
          offender_vehicles,
          disciplinary_committed_id,
          officer_id,
          seized_date,
          seizure_location,
          fine_paid,
          seized_item
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                newSeizureRecordId,
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

export async function caseFilterWithDatePaginateData(
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
        SELECT DISTINCT vsr.id,
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
          dc.fine_amount AS fine_amount,
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
        WHERE (
          (vsr.action_date IS NOT NULL AND vsr.action_date BETWEEN ? AND ?)
          OR
          (vsr.action_date IS NULL AND vsr.seized_date BETWEEN ? AND ?)
        )
          AND (? = '' OR v.vehicle_categories_id = ?)
        ORDER BY COALESCE(vsr.action_date, vsr.seized_date) DESC
        LIMIT ? OFFSET ?
        `,
            [
                startDate,
                endDate,
                startDate,
                endDate,
                vehicleCategoryId,
                vehicleCategoryId,
                limit,
                offset,
            ]
        );

        return results;
    } catch (error: any) {
        console.error('Error fetching case records:', error);
        return { success: false, message: error.message };
    }
}

export async function caseFilterWithDateData(
    startDate: string,
    endDate: string,
    vehicleCategoryIdStr: string,
    exportType: ExportTypeEnum
) {
    const db = await getDatabase();

    try {
        const vehicleCategoryId = vehicleCategoryIdStr ? Number(vehicleCategoryIdStr) : '';

        // Build base condition
        let dateFilter = '';
        const params: any[] = [];

        switch (exportType) {
            case ExportTypeEnum.Filed:
                dateFilter = `vsr.action_date IS NOT NULL AND vsr.case_number IS NOT NULL AND vsr.action_date BETWEEN ? AND ?`;
                params.push(startDate, endDate);
                break;

            case ExportTypeEnum.UnFiled:
                dateFilter = `vsr.action_date IS NULL AND vsr.case_number IS NULL AND vsr.seized_date BETWEEN ? AND ?`;
                params.push(startDate, endDate);
                break;

            case ExportTypeEnum.All:
            default:
                dateFilter = `
            (
              (vsr.action_date IS NOT NULL AND vsr.action_date BETWEEN ? AND ?)
              OR
              (vsr.action_date IS NULL AND vsr.seized_date BETWEEN ? AND ?)
            )
          `;
                params.push(startDate, endDate, startDate, endDate);
                break;
        }

        params.push(vehicleCategoryId, vehicleCategoryId);

        const results = await db.getAllAsync(
            `
        SELECT
          vsr.action_date,
          vsr.case_number,
          vsr.seized_date,
          vsr.seizure_location,
          o.name AS offender_name,
          o.father_name AS offender_father_name,
          o.national_id_number,
          o.address,
          v.vehicle_number,
          v.vehicle_types,
          da.number AS article_number,
          dc.fine_amount,
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
        WHERE ${dateFilter}
          AND (? = '' OR v.vehicle_categories_id = ?)
        ORDER BY COALESCE(vsr.action_date, vsr.seized_date) DESC
        `,
            params
        );

        return results;
    } catch (error: any) {
        console.error('Error fetching case records:', error);
        return { success: false, message: error.message };
    }
}

export async function caseFilterWithDateData2(
    startDate: string,
    endDate: string,
    vehicleCategoryIdStr: string,
    exportType: ExportTypeEnum
) {
    const db = await getDatabase();

    try {
        const vehicleCategoryId = vehicleCategoryIdStr ? Number(vehicleCategoryIdStr) : null;

        let dateFilter = '';
        const params: any[] = [];

        switch (exportType) {
            case ExportTypeEnum.Filed:
                dateFilter = `
            vsr.action_date IS NOT NULL
            AND vsr.case_number IS NOT NULL
            AND vsr.action_date BETWEEN ? AND ?
          `;
                params.push(startDate, endDate);
                break;

            case ExportTypeEnum.UnFiled:
                dateFilter = `
            vsr.action_date IS NULL
            AND vsr.case_number IS NULL
            AND vsr.seized_date BETWEEN ? AND ?
          `;
                params.push(startDate, endDate);
                break;

            case ExportTypeEnum.All:
            default:
                dateFilter = `
            (
              (vsr.action_date IS NOT NULL AND vsr.action_date BETWEEN ? AND ?)
              OR
              (vsr.action_date IS NULL AND vsr.seized_date BETWEEN ? AND ?)
            )
          `;
                params.push(startDate, endDate, startDate, endDate);
                break;
        }

        if (vehicleCategoryId !== null) {
            dateFilter += ` AND v.vehicle_categories_id = ?`;
            params.push(vehicleCategoryId);
        }

        const results = await db.getAllAsync(
            `
        SELECT
          vsr.id AS seizure_id,
          vsr.seized_date,
          vsr.action_date,
          vsr.case_number,
          vsr.seizure_location,
          vsr.fine_paid,
          vsr.created_at AS seizure_created_at,
          vsr.updated_at AS seizure_updated_at,
  
          -- offender_vehicles
          ov.id AS offender_vehicle_id,
          ov.created_at AS offender_vehicle_created_at,
          ov.updated_at AS offender_vehicle_updated_at,
  
          -- offenders
          o.id AS offender_id,
          o.name AS offender_name,
          o.father_name AS offender_father_name,
          o.national_id_number,
          o.driver_license_number,
          o.address AS offender_address,
          o.created_at AS offender_created_at,
          o.updated_at AS offender_updated_at,
  
          -- vehicles
          v.id AS vehicle_id,
          v.vehicle_number,
          v.vehicle_categories_id,
          v.vehicle_types,
          v.wheel_tax,
          v.vehicle_license_number,
          v.created_at AS vehicle_created_at,
          v.updated_at AS vehicle_updated_at,
  
          -- disciplinary_committed
          dc.id AS disciplinary_committed_id,
          dc.fine_amount,
          dc.created_at AS dc_created_at,
          dc.updated_at AS dc_updated_at,
  
          -- disciplinary_articles
          da.id AS article_id,
          da.number AS article_number,
  
          -- committed_offenses
          co.id AS offense_id,
          co.name AS offense_name,
  
          -- officers
          of.id AS officer_id,
          of.name AS officer_name,
  
          -- seized_items
          si.id AS seized_item_id,
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
  
        WHERE ${dateFilter}
        ORDER BY COALESCE(vsr.action_date, vsr.seized_date) DESC
        `,
            params
        );

        return results;
    } catch (error: any) {
        console.error('Error fetching case records:', error);
        return { success: false, message: error.message };
    }
}



export async function importExcelData(data: any[], vehicleCategoryId: number) {
    const db = await getDatabase();

    try {
        for (const item of data) {
            const name = getNormalizedValue(item, ImportEnum.Name);
            const fatherName = getNormalizedValue(item, ImportEnum.FatherName);

            const nationalIdRaw = getNormalizedValue(item, ImportEnum.NRC);
            const nationalId = (nationalIdRaw === "မရှိ" || nationalIdRaw === "") ? "" : nationalIdRaw;

            const address = getNormalizedValue(item, ImportEnum.Address);
            const disciplinaryCommitted = getNormalizedValue(item, ImportEnum.ActionTakenSection);
            const actionOfficer = getNormalizedValue(item, ImportEnum.ActionOfficer);
            const seizedItem = getNormalizedValue(item, ImportEnum.SeizedItems);
            const vehicleNumber = getNormalizedValue(item, ImportEnum.VehicleNumber);
            const vehicleTypes = getNormalizedValue(item, ImportEnum.VehicleTypeAndColor);
            const seizedLocation = getNormalizedValue(item, ImportEnum.Location);
            const seizedDate = getNormalizedValue(item, ImportEnum.Date);
            const actionDate = getNormalizedValue(item, ImportEnum.ActionTakenDate);
            const caseNumber = getNormalizedValue(item, ImportEnum.CaseNumber);

            // 1. Check or insert offender
            const existingOffender = await db.getFirstAsync(
                `
            SELECT id FROM offenders 
            WHERE name = ? AND father_name = ? AND national_id_number=? AND address=?
            `,
                [name, fatherName, nationalId, address]
            ) as any;


            let offenderId: number | null = null;
            if (existingOffender) {
                offenderId = existingOffender.id;
            } else {

                const result = await db.runAsync(
                    `
                    INSERT INTO offenders (name, father_name, national_id_number, address) 
                    VALUES (?, ?, ?, ?)
                    `,
                    [name, fatherName, nationalId, address]
                ) as any;
                offenderId = result.lastInsertRowId;
            }


            const existingVehicle = await db.getFirstAsync(
                `
            SELECT id FROM vehicles 
            WHERE vehicle_number = ? AND vehicle_categories_id = ? AND vehicle_types = ?
            `,
                [vehicleNumber, vehicleCategoryId, vehicleTypes]
            ) as any;

            let vehicleId: number | null = null;
            if (existingVehicle) {
                vehicleId = existingVehicle.id;
            } else {
                const result = await db.runAsync(
                    `
                    INSERT INTO vehicles (vehicle_number, vehicle_categories_id, vehicle_types)
                    VALUES (?, ?, ?)
                    `,
                    [vehicleNumber, vehicleCategoryId, vehicleTypes]
                ) as any;
                vehicleId = result.lastInsertRowId;
            }

            // offender vehicle process
            let offenderVehicleId: number | null = null;
            if (existingVehicle && existingOffender) {
                offenderVehicleId = await db.getFirstAsync(
                    `
                SELECT id FROM offender_vehicles 
                WHERE offender_id = ? AND vehicle_id = ?
                `,
                    [offenderId, vehicleId]
                ).then((result: any) => result?.id);;
            } else {
                const result = await db.runAsync(
                    `
                    INSERT INTO offender_vehicles (offender_id, vehicle_id)
                    VALUES (?, ?)
                    `,
                    [offenderId, vehicleId]
                ) as any;
                offenderVehicleId = result.lastInsertRowId;
            }


            // displinary process
            const articleOffense = getArticleAndOffense(disciplinaryCommitted);
            let disciplinaryCommittedId: number | null = null;
            if (articleOffense) {
                const { articleNumber, offenseName } = articleOffense;

                const result = await db.getFirstAsync(
                    `
                    SELECT dc.id
                    FROM disciplinary_committed dc
                    JOIN disciplinary_articles da ON dc.disciplinary_articles_id = da.id
                    JOIN committed_offenses co ON dc.committed_offenses_id = co.id
                    WHERE da.number = ? AND co.name = ?
                    `,
                    [articleNumber, offenseName]
                ) as any;
                disciplinaryCommittedId = result.id

            }

            // officerProcess
            let officerId: number | null = null;
            officerId = await db.getFirstAsync(
                `
                SELECT oc.id
                FROM officers oc
                WHERE oc.name = ?
                `,
                [actionOfficer]
            ).then((result: any) => result?.id);;


            // seized Item process
            let seizedItemId: number | null = null;
            seizedItemId = await db.getFirstAsync(
                `SELECT si.id FROM seized_items si WHERE si.name = ?`,
                [seizedItem]
            ).then((result: any) => result?.id);


            if (offenderId && vehicleId && offenderVehicleId && disciplinaryCommittedId && officerId && seizedItemId) {

                const existingRecord = await db.getFirstAsync(
                    `
                    SELECT id FROM vehicle_seizure_records 
                    WHERE offender_vehicles = ? AND disciplinary_committed_id = ? AND officer_id=? AND seized_date=? AND seizure_location=? AND seized_item=?
                `,
                    [offenderVehicleId, disciplinaryCommittedId, officerId, seizedDate, seizedLocation, seizedItemId]
                ) as any;

                if (existingOffender) {
                    await db.runAsync(
                        `
                        UPDATE vehicle_seizure_records
                        SET case_number = ?, action_date = ?, updated_at = datetime('now')
                        WHERE id = ?
                        `,
                        [caseNumber, actionDate, existingRecord.id]
                    );
                } else {
                    await db.runAsync(
                        `
                            INSERT INTO vehicle_seizure_records (
                              offender_vehicles,
                              disciplinary_committed_id,
                              officer_id,
                              seized_date,
                              seizure_location,
                              action_date,
                              case_number,
                              seized_item
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                            `,
                        [
                            offenderVehicleId,
                            disciplinaryCommittedId,
                            officerId,
                            seizedDate,
                            seizedLocation,
                            actionDate,
                            caseNumber,
                            seizedItemId,
                        ]
                    );
                }

            }
        }
        return {
            success: true,
        };
    } catch (err) {
        console.error("Error in import data:", err);
        return { success: false, error: err instanceof Error ? err.message : err };
    }

}

export async function importJsonData(data: any[]) {
    const db = await getDatabase();

    try {
        await Promise.all(
            data.map(async (data) => {
                const {
                    vehicle_id,
                    offender_vehicle_id,
                    vehicle_categories_id,
                    vehicle_number,
                    vehicle_types,
                    offender_id,
                    offender_name,
                    offender_father_name,
                    national_id_number,
                    driver_license_number,
                    offender_address,
                    seizure_id,
                    disciplinary_committed_id,
                    officer_id,
                    seized_date,
                    seizure_location,
                    action_date,
                    case_number,
                    seized_item_id
                } = data;

                const offenderVehicle = await db.getFirstAsync(
                    `SELECT * FROM offender_vehicles WHERE id = ?`,
                    [offender_vehicle_id]
                ) as any;
                let offenderVehicleId = offenderVehicle?.id || null;

                if (!offenderVehicleId) {
                    const vehicle = await db.getFirstAsync("SELECT * FROM vehicles WHERE id = ?", [vehicle_id]) as any;
                    let vehicleId = vehicle?.id || null;

                    if (!vehicleId) {
                        await db.runAsync(
                            `INSERT INTO vehicles (
                  id, vehicle_number, vehicle_categories_id, vehicle_types,
                  wheel_tax, vehicle_license_number, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                            [vehicle_id, vehicle_number, vehicle_categories_id, vehicle_types, null, null]
                        );
                        vehicleId = vehicle_id;
                    }

                    const offender = await db.getFirstAsync("SELECT * FROM offenders WHERE id = ?", [offender_id]) as any;
                    let offenderId = offender?.id || null;

                    if (!offenderId) {
                        await db.runAsync(
                            `INSERT INTO offenders (
                  id, name, father_name, national_id_number,
                  driver_license_number, address
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                            [
                                offender_id,
                                offender_name,
                                offender_father_name,
                                national_id_number,
                                driver_license_number,
                                offender_address
                            ]
                        );
                        offenderId = offender_id;
                    }

                    await db.runAsync(
                        `INSERT INTO offender_vehicles (id, offender_id, vehicle_id)
               VALUES (?, ?, ?)`,
                        [offender_vehicle_id, offender_id, vehicle_id]
                    );

                    offenderVehicleId = offender_vehicle_id;
                }

                const seizureRecords = await db.getFirstAsync(
                    `SELECT * FROM vehicle_seizure_records WHERE id = ?`,
                    [seizure_id]
                ) as any;

                if (seizureRecords) {
                    await db.runAsync(
                        `UPDATE vehicle_seizure_records
               SET case_number = ?, action_date = ?
               WHERE id = ?`,
                        [case_number, action_date, seizure_id]
                    );
                } else {
                    await db.runAsync(
                        `INSERT INTO vehicle_seizure_records (
                id, offender_vehicles, disciplinary_committed_id,
                officer_id, seized_date, seizure_location,
                fine_paid, seized_item, case_number, action_date
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            seizure_id,
                            offenderVehicleId,
                            disciplinary_committed_id,
                            officer_id,
                            seized_date,
                            seizure_location,
                            0,
                            seized_item_id,
                            case_number,
                            action_date
                        ]
                    );
                }
            })
        );

        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : err };
    }
}





export async function test() {
    const db = await getDatabase();

    await db.runAsync(`
        UPDATE offenders
        SET national_id_number = NULL
        WHERE id = 9
    `);

    // Verify update
    const updatedOffender = await db.getAllAsync("SELECT * FROM offenders WHERE id = 9");
    console.log("Updated offender:", updatedOffender);
    // const v = await db.getAllAsync("select * from vehicles");
    // console.log(v);

    // const o = await db.getAllAsync("select * from offenders");

    // console.log(o)
}



