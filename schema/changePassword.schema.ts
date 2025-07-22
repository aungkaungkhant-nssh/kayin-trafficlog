import { z } from "zod";

export const changePasswordSchema = z
    .object({
        oldPassword: z.string().nonempty({ message: "စကားဝှက်ဟောင်းလိုအပ်သည်" }),
        newPassword: z
            .string()
            .min(8, { message: "စကားဝှက်သည်အနည်းဆုံးစာလုံး 8 လိုအပ်သည်" }),
        confirmNewPassword: z.string().nonempty({ message: "စစ်ဆေးရန်စကားဝှက်လိုအပ်သည်" }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "စကားဝှက်နှစ်ခုမတူပါ",
        path: ["confirmNewPassword"],
    });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;