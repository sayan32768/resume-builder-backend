import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const personalFormSchema = z.object({
    fullName: z
        .string()
        .optional()
        .transform((v) =>
            v ? v.trim().replace(/\s+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : v
        )
        .refine(
            (v) => !v || /^[a-zA-Z\s]+$/.test(v),
            { message: "Only letters and spaces are allowed" }
        ),

    email: z
        .string()
        .optional()
        .transform((v) => (v ? v.toLowerCase().trim() : v))
        .refine(
            (v) => !v || /^\S+@\S+$/.test(v),
            { message: "Invalid email address" }
        ),

    phone: z
        .string()
        .optional()
        .refine(
            (value) => {
                if (!value) return true; // allow empty
                const phoneNumber = parsePhoneNumberFromString(value);
                if (!phoneNumber) return false;
                return phoneNumber.isValid();
            },
            { message: "Invalid phone number" }
        ),

    address: z.string().optional(),
    about: z.string().optional(),

    socials: z
        .array(
            z.object({
                name: z.enum(["LINKEDIN", "INSTAGRAM", "GITHUB"]).optional(),
                link: z.string().url("Invalid link").optional(),
            })
        )
        .optional(),
});

export const educationFormSchema = z.object({
    name: z.string().optional(),
    degree: z.string().optional(),
    dates: z
        .object({
            startDate: z.coerce.date().nullable().optional(),
            endDate: z.coerce.date().nullable().optional(),
        })
        .optional()
        .refine(
            (obj) => {
                if (!obj?.startDate || !obj?.endDate) return true;
                return obj.startDate < obj.endDate;
            },
            { message: "Enter valid dates", path: [] }
        ),
    location: z.string().optional(),
    grades: z
        .object({
            type: z.enum(["Percentage", "CGPA"], { message: "Select a type" }).optional(),
            score: z.string().optional(),
            message: z.string().optional(),
        })
        .optional()
        .refine(
            (grade) => {
                if ((grade?.score && !grade?.type) || (grade?.type && !grade?.score)) {
                    return false;
                }
                return true;
            },
            { message: "Both score and type is required" }
        ),
});

export const experienceSchema = z.object({
    companyName: z.string().optional(),
    companyAddress: z.string().optional(),
    position: z.string().optional(),
    dates: z
        .object({
            startDate: z.coerce.date().nullable().optional(),
            endDate: z.coerce.date().nullable().optional(),
        })
        .optional()
        .refine(
            (obj) => {
                if (!obj?.startDate || !obj?.endDate) return true;
                return obj.startDate < obj.endDate;
            },
            { message: "Enter valid dates", path: [] }
        ),
    workDescription: z.string().optional(),
});

export const skillSchema = z.object({
    skillName: z.string().optional(),
});

export const projectSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    extraDetails: z.string().optional(),
    links: z
        .array(
            z.object({
                link: z.url("Invalid link").or(z.literal("")),
            })
        )
        .optional(),
});

export const certificationSchema = z.object({
    issuingAuthority: z.string().optional(),
    title: z.string().optional(),
    issueDate: z
        .coerce.date().nullable()
        .optional()
        .refine(
            (obj) => {
                if (!obj) return true;
                return obj < new Date();
            },
            { message: "Enter a valid date" }
        ),
    link: z.url().optional().or(z.literal("")),
});

export const resumeSchema = z.object({
    resumeTitle: z.string().optional(),
    resumeType: z.enum(["Classic", "Modern"]).optional(),
    personalDetails: personalFormSchema.optional(),
    educationDetails: z.array(educationFormSchema).optional(),
    skills: z.array(skillSchema).optional(),
    professionalExperience: z.array(experienceSchema).optional(),
    projects: z.array(projectSchema).optional(),
    otherExperience: z.array(experienceSchema).optional(),
    certifications: z.array(certificationSchema).optional(),
});
