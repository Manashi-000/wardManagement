import * as z from "zod";

export const complaintsFromUserSchema = z.object({
  subject: z.string(),
  description: z.string(),
  images: z.array(z.string()).optional(),
  taggedLocation: z.string(),
  category: z.enum(["ROAD", "ELECTRICITY", "EDUCATION", "WATER", "DRAINAGE", "OTHERS"]),
  userId: z.string().optional(),
  status: z.enum([
    "REGISTERED",
    "INPROGRESS",
    "RESOLVED"
  ])

});
export const adminRespondSchema = z.object({
  response: z.string().optional(),
  status: z.enum(["REGISTERED", "INPROGRESS", "RESOLVED"])
});
