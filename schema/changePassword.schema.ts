import { z } from "zod";

export const changePasswordSchema = z
    .object({
        name: z.string().nonempty({ message: "အသုံးပြုသူအမည် လိုအပ်သည်။" }),
        userName: z.string().nonempty({ message: "အသုံးပြုသူအမည် လိုအပ်သည်။" }),
        oldPassword: z
            .string()
            .nonempty({ message: "အဟောင်းစကားဝှက် လိုအပ်သည်။" })
            .min(8, { message: "အဟောင်းစကားဝှက်အနည်းဆုံး အက္ခရာ 8 လုံး လိုအပ်သည်" }),
        newPassword: z
            .string()
            .nonempty({ message: "စကားဝှက်အသစ် လိုအပ်သည်။" })
            .min(8, { message: "စကားဝှက်အသစ်အနည်းဆုံး အက္ခရာ 8 လုံး လိုအပ်သည်" }),
        confirmNewPassword: z
            .string()
            .nonempty({ message: "စစ်ဆေးရန်စကားဝှက်လိုအပ်သည်" }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "စကားဝှက်နှစ်ခုမတူပါ",
        path: ["confirmNewPassword"],
    });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;