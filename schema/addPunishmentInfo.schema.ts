import { z } from "zod";

export const addPunishmentInfoSchema = z.object({
    name: z.string().nonempty({ message: "ယာဉ်မောင်းအမည်လိုအပ်သည်" }),
    father_name: z.string().nonempty({ message: "အဘအမည်လိုအပ်သည်" }),
    nrcState: z.string(),
    nrcTownShip: z.string(),
    nrcType: z.string(),
    nrcNumber: z.string(),
    driver_license_number: z.string().nullable().optional(),
    address: z.string().nonempty({ message: "နေရပ်လိပ်စာလိုအပ်သည်" }),

    vehicle_number: z.string().nonempty({ message: "ယာဉ်နံပါတ်လိုအပ်သည်" }),               // INTEGER NOT NULL
    vehicle_categories_id: z.string(),
    vehicle_categories_label: z.string(),       // INTEGER NOT NULL (foreign key)
    vehicle_types: z.string().nonempty({ message: "ယာဉ်မော်ဒယ်လိုအပ်သည်" }),               // TEXT NOT NULL
    wheel_tax: z.string().nullable().optional(),    // TEXT, nullable
    vehicle_license_number: z.string().nullable().optional(),

    seized_date: z.string().nonempty({ message: "ဖမ်းဆည်းသည့်နေ့လိုအပ်သည်" }),
    seizure_location: z.string().nonempty({ message: "ဖမ်းဆည်းသည့်နေရာလိုအပ်သည်" }),

    article_id: z.string().nonempty({ message: "ပုဒ်မလိုအပ်သည်" }),
    article_label: z.string(),
    committed_id: z.string().nonempty({ message: "ကျူးလွန်ပြစ်မှုလိုအပ်သည်" }),
    committed_label: z.string(),
    fine_amount: z.string(),

    seizedItem_id: z.string(),
    seizedItem_label: z.string()
});

export type AddPunishmentInfoSchemaType = z.infer<typeof addPunishmentInfoSchema>;