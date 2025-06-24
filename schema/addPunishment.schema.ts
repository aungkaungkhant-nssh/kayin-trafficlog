import { z } from "zod";

export const addPunishmentSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    father_name: z.string().min(1),
    nrcState: z.string(),
    nrcTownShip: z.string(),
    nrcType: z.string(),
    nrcNumber: z.string(),
    driver_license_number: z.string().nullable().optional(),
    address: z.string().min(1),


    vehicle_number: z.string(),               // INTEGER NOT NULL
    vehicle_categories_id: z.string(),        // INTEGER NOT NULL (foreign key)
    vehicle_types: z.string().min(1),               // TEXT NOT NULL
    wheel_tax: z.string().nullable().optional(),    // TEXT, nullable
    vehicle_license_number: z.string().nullable().optional(),

    seized_date: z.string(),
    seizure_location: z.string(),

    articleId: z.string(),
    committedId: z.string(),
    fineAmount: z.string()
});

export type AddPunishmentSchemaType = z.infer<typeof addPunishmentSchema>;