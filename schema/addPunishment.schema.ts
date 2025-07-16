import { z } from "zod";

export const addPunishmentSchema = z.object({
    seized_date: z.string().nonempty({ message: "ဖမ်းဆည်းသည့်နေ့လိုအပ်သည်" }),
    seizure_location: z.string().nonempty({ message: "ဖမ်းဆည်းသည့်နေရာလိုအပ်သည်" }),

    article_id: z.string().nonempty({ message: "ပုဒ်မလိုအပ်သည်" }),
    article_label: z.string(),
    committed_id: z.string().nonempty({ message: "ကျူးလွန်ပြစ်မှုလိုအပ်သည်" }),
    committed_label: z.string(),
    fine_amount: z.string(),

    seizedItem_id: z.string(),
    seizedItem_label: z.string(),

    vehicle_number: z.string().optional(), // was: isOptional() → use .optional()
    vehicle_categories_id: z.string().optional(),
    vehicle_categories_label: z.string(),
    vehicle_types: z.string().optional(),
});

export type AddPunishmentSchemaType = z.infer<typeof addPunishmentSchema>;