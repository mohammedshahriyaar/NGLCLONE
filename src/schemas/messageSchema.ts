import {z} from 'zod'


export const MessageSchema = z.object({
    content:z
    .string()
    .min(10,{message:"content must be atleast 1o characters"})
    .max(300,{message:"content must be atmost 300 characters"})
})