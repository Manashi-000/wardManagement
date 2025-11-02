import * as z from "zod";

// Login: require either email OR googleId
export const loginSchema = z
  .object({
    email: z.string().email("Invalid email").optional(),
    googleId: z.string().optional(),
  })
  .refine((data) => data.email || data.googleId, {
    message: "Either email or googleId is required",
  });

// Signup: require email + username, optionally image and googleId
export const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  image: z.string().url("Invalid image URL").optional(),
  googleId: z.string().optional(),
});
