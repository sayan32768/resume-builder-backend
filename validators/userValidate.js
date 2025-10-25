import { z } from "zod";

export const userSchema = z.object({
    fullName: z.string().min(1, "Full name is required").default(""),
    username: z.string().min(1, "Username is required").trim().default(""),
    email: z.email("Invalid email address").default(""),
    password: z.string().min(8, "Password must be at least 8 characters long").default(""),
    isVerified: z.boolean().optional().default(false),
    isLoggedIn: z.boolean().optional().default(false),
    token: z.string().nullable().optional(),
    otp: z.string().nullable().optional(),
    otpExpiry: z.date().nullable().optional(),
});

export const validateUser = (schema) => async (req, res, next) => {
    try {
        schema.parse(req.body);
        next()
    } catch (error) {
        return res.status(400).json({ message: "Validaton failed" })
    }
}