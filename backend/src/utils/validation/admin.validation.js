import * as z from 'zod'
export const createPostSchema = z.object({
    postname: z.string(),
    postDescription: z.string(),
    image: z.array(z.string()).optional(),
});

