import { z } from "zod";

// Zod schema for login validation (checks email structure and password length)
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email format.")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 6 characters.")
});
