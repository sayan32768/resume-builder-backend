import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const personalFormSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .regex(/^\S+@\S+$/i, "Invalid email address")
        .transform((value) => value.toLowerCase().trim()),
    phone: z
        .string()
        .min(1, "Phone is required")
        .refine(
            (value) => {
                const phoneNumber = parsePhoneNumberFromString(value);
                if (!phoneNumber) return false;
                return phoneNumber.isValid();
            },
            {
                message: "Invalid phone number",
            }
        ),
    address: z.string().optional(),
    about: z.string().optional(),
    socials: z
        .array(
            z.object({
                name: z.enum(["LINKEDIN", "INSTAGRAM", "GITHUB"]),
                link: z.url("Invalid link").or(z.literal("")),
            })
        )
        .optional(),
});

export const educationFormSchema = z.object({
    name: z.string().optional(),
    degree: z.string().min(1, "Degree is required"),
    dates: z
        .object({
            startDate: z.coerce.date().optional(),
            endDate: z.coerce.date().optional(),
        })
        .optional()
        .refine(
            (obj) => {
                if (!obj?.startDate || !obj?.endDate) return true;
                return obj.startDate < obj.endDate;
            },
            {
                message: "Enter valid dates",
                path: [],
            }
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
            {
                message: "Both score and type is required",
            }
        ),
});

export const experienceSchema = z.object({
    companyName: z.string().min(1, "Name is required"),
    companyAddress: z.string().optional(),
    position: z.string().optional(),
    dates: z
        .object({
            startDate: z.coerce.date().optional(),
            endDate: z.coerce.date().optional(),
        })
        .optional()
        .refine(
            (obj) => {
                if (!obj?.startDate || !obj?.endDate) return true;
                return obj.startDate < obj.endDate;
            },
            {
                message: "Enter valid dates",
                path: [],
            }
        ),
    workDescription: z.string().optional(),
});

export const skillSchema = z.object({
    skillName: z.string().min(1, "Enter a skill"),
});

export const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
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
    issuingAuthority: z.string().min(1, "This is a required field"),
    title: z.string().min(1, "Title is required"),
    issueDate: z
        .coerce.date()
        .optional()
        .refine(
            (obj) => {
                if (!obj) return true;
                return obj < new Date();
            },
            {
                message: "Enter a valid date",
            }
        ),
    link: z.url().optional().or(z.literal("")),
});

export const resumeSchema = z.object({
    resumeType: z.enum(["Classic", "Modern"], {
        message: "Choose a valid resume type"
    }),
    personalDetails: personalFormSchema,
    educationDetails: z.array(educationFormSchema).min(1, "At least one education is required"),
    skills: z.array(skillSchema).optional(),
    professionalExperience: z.array(experienceSchema).optional(),
    projects: z.array(projectSchema).optional(),
    otherExperience: z.array(experienceSchema).optional(),
    certifications: z.array(certificationSchema).optional(),
});
