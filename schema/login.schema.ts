import { z } from "zod";

export const loginSchema = z.object({
    name: z.string().nonempty({ message: "အမည်လိုအပ်သည်" }),
    password: z.string().nonempty({ message: "စကားဝှက်လိုအပ်သည်" }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;