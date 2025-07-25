import { z } from "zod";

export const searchSchema = z.object({
    name: z.string(),
    fatherName: z.string(),
    nrcState: z.string(),
    nrcTownShip: z.string(),
    nrcType: z.string(),
    nrcNumber: z.string(),
    vehicleNumber: z.string(),
    vehicleLicense: z.string().optional(),
});

export type SearchSchemaType = z.infer<typeof searchSchema>;