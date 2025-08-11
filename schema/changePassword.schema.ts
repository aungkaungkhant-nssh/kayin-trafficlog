import { z } from "zod";

export const changePasswordSchema = z
    .object({
        userName: z.string().nonempty({ message: "အသုံးပြုသူအမည် လိုအပ်သည်။" }),
        oldPassword: z.string(),
        newPassword: z
            .string(),
        confirmNewPassword: z.string({ message: "စစ်ဆေးရန်စကားဝှက်လိုအပ်သည်" }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "စကားဝှက်နှစ်ခုမတူပါ",
        path: ["confirmNewPassword"],
    });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;