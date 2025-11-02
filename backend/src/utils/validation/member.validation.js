import * as z from "zod";

export const createMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  contactNumber: z
    .string()
    .regex(/^\d{7,15}$/, "Contact number must be 7-15 digits"),
  classification: z.enum(["REPRESENTATIVE", "PUBLIC_SERVICE"]),
  image: z.string().optional(),
});
