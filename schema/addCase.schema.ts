import { z } from "zod";

export const addCaseSchema = z.object({
    case_number: z
        .string()
        .nonempty({ message: "တရားစွဲအမှတ် လိုအပ်သည်။" })
        .regex(/^\d+$/, { message: "တရားစွဲအမှတ် သည် ဂဏန်းဖြစ်ရမည်။" }),
    action_date: z.string().nonempty({ message: "တရားစွဲသည့်နေ့ လိုအပ်သည်။" }),
});

export type AddCaseSchemaType = z.infer<typeof addCaseSchema>;