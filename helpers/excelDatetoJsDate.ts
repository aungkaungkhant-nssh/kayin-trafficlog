import { format } from 'date-fns';

function excelDateToJSDate(serial: number): string {
    const utc_days = serial - 25569;
    const utc_value = utc_days * 86400 * 1000; // milliseconds in day
    const date = new Date(utc_value);

    // Format date as 'yyyy-MM-dd'
    return format(date, 'yyyy-MM-dd');
}

export default excelDateToJSDate;


// export async function storePunishment(data: AddPunishmentInfoSchemaType, officerId: number) {
//     const db = await getDatabase();


//     try {
//         await db.execAsync("PRAGMA foreign_keys = ON;");

//         // Utility to remove all space characters from strings

//         const {
//             name,
//             father_name,
//             nrcState,
//             nrcTownShip,
//             nrcType,
//             nrcNumber,
//             driver_license_number,
//             address,
//             vehicle_number,
//             vehicle_categories_id,
//             vehicle_types,
//             wheel_tax,
//             vehicle_license_number,
//             committed_id,
//             seized_date,
//             seizure_location,
//             fine_amount,
//             seizedItem_id,
//         } = data;

//         const committedIdInt = parseInt(committed_id, 10);
//         const seizedItemIdInt = parseInt(seizedItem_id, 10);
//         const vehicleCategoriesInt = parseInt(vehicle_categories_id, 10);

//         // id generate
//         const baseId = Date.now();
//         const newVehicleId = baseId + 1;
//         const newOffenderVehicleId = baseId + 2;
//         const newSeizureRecordId = baseId + 3;

//         const oldDate = '2020-01-01 00:00:00';


//         if (
//             isNaN(committedIdInt) ||
//             isNaN(seizedItemIdInt) ||
//             isNaN(vehicleCategoriesInt)
//         ) {
//             throw new Error("Invalid committed_id, seizedItem_id, or vehicle_categories_id. They must be valid numbers.");
//         }


//         const committedRow = await db.getFirstAsync(
//             `SELECT id FROM disciplinary_committed WHERE id = ?`,
//             [committedIdInt]
//         );
//         if (!committedRow) throw new Error(`committed_id ${committedIdInt} does not exist.`);


//         const seizedItemRow = await db.getFirstAsync(
//             `SELECT id FROM seized_items WHERE id = ?`,
//             [seizedItemIdInt]
//         );
//         if (!seizedItemRow) throw new Error(`seizedItem_id ${seizedItemIdInt} does not exist.`);

//         const vehicleCategoryRow = await db.getFirstAsync(
//             `SELECT id FROM vehicle_categories WHERE id = ?`,
//             [vehicleCategoriesInt]
//         );
//         if (!vehicleCategoryRow) throw new Error(`vehicle_categories_id ${vehicleCategoriesInt} does not exist.`);

//         // Construct NRC Burmese formatted number
//         const nrcNumberMM = toBurmeseNumber(nrcNumber);
//         let nationalIdNumber = "";
//         if (nrcState && nrcTownShip && nrcType && nrcNumberMM) {
//             nationalIdNumber = `${getNrcStateMM(nrcState)}${sanitize(nrcTownShip)}(${sanitize(nrcType)})${nrcNumberMM}`;
//         }

//         // Insert offender
//         await db.runAsync(
//             `INSERT INTO offenders (id, name, father_name, national_id_number, driver_license_number, address, created_at, updated_at)
//              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 baseId,
//                 sanitize(name),
//                 sanitize(father_name),
//                 sanitize(nationalIdNumber),
//                 sanitize(driver_license_number),
//                 sanitize(address),
//                 '2020-01-01 00:00:00', // custom created_at
//                 '2020-01-01 00:00:00'  // custom updated_at
//             ]
//         );

//         const { id: offenderId } = (await db.getFirstAsync(
//             `SELECT last_insert_rowid() as id`
//         )) as any;
//         if (!offenderId) throw new Error("Failed to insert offender.");

//         // Insert vehicle
//         await db.runAsync(
//             `INSERT INTO vehicles (
//                id, vehicle_number, vehicle_categories_id, vehicle_types,
//                wheel_tax, vehicle_license_number, created_at, updated_at
//              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 newVehicleId,
//                 sanitize(vehicle_number),
//                 vehicleCategoriesInt,
//                 sanitize(vehicle_types),
//                 wheel_tax ?? null,
//                 sanitize(vehicle_license_number),
//                 oldDate, // created_at
//                 oldDate  // updated_at
//             ]
//         );

//         const { id: vehicleId } = (await db.getFirstAsync(
//             `SELECT last_insert_rowid() as id`
//         )) as any;
//         if (!vehicleId) throw new Error("Failed to insert vehicle.");

//         // Link offender and vehicle
//         await db.runAsync(
//             `INSERT INTO offender_vehicles (
//                id, offender_id, vehicle_id, created_at, updated_at
//              ) VALUES (?, ?, ?, ?, ?)`,
//             [
//                 newOffenderVehicleId,
//                 offenderId,
//                 vehicleId,
//                 oldDate,
//                 oldDate
//             ]
//         );

//         const { id: offenderVehicleId } = (await db.getFirstAsync(
//             `SELECT last_insert_rowid() as id`
//         )) as any;
//         if (!offenderVehicleId) throw new Error("Failed to insert offender_vehicle.");

//         // Insert vehicle seizure record
//         await db.runAsync(
//             `INSERT INTO vehicle_seizure_records (
//                id, offender_vehicles, disciplinary_committed_id, officer_id, seized_date,
//                seizure_location, fine_paid, action_date, case_number, seized_item,
//                created_at, updated_at
//              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 newSeizureRecordId,
//                 offenderVehicleId,
//                 committedIdInt,
//                 officerId,
//                 oldDate, // seized_date
//                 sanitize(seizure_location),
//                 fine_amount ? parseFloat(fine_amount.toString()) : 0,
//                 null,
//                 null,
//                 seizedItemIdInt,
//                 oldDate,
//                 oldDate
//             ]
//         );

//         const { id: seizureRecordId } = (await db.getFirstAsync(
//             `SELECT last_insert_rowid() as id`
//         )) as any;
//         if (!seizureRecordId) throw new Error("Failed to insert vehicle_seizure_record.");

//         return {
//             success: true,
//             offenderId,
//             vehicleId,
//             offenderVehicleId,
//             seizureRecordId,
//         };
//     } catch (err) {
//         console.error("Error in storePunishment:", err);
//         return { success: false, error: err instanceof Error ? err.message : err };
//     }
// }

