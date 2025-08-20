import { z } from "zod";

export const loginSchema = z.object({
    name: z.string().nonempty({ message: "အမည်လိုအပ်သည်" }),
    password: z
        .string()
        .nonempty({ message: "စကားဝှက်လိုအပ်သည်" })
        .min(8, { message: "စကားဝှက်အနည်းဆုံး အက္ခရာ 8 လုံး လိုအပ်သည်" }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;