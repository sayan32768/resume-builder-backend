import mongoose from "mongoose";

const linksSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["LINKEDIN", "INSTAGRAM", "GITHUB"],
    },
    link: {
        type: String,
    }
});

const personalDetailsSchema = new mongoose.Schema({
    fullName: { type: String },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String },
    socials: { type: [linksSchema], default: [] },
    address: { type: String },
    about: { type: String },
});

const gradesSchema = new mongoose.Schema({
    type: { type: String, enum: ["Percentage", "CGPA"] },
    score: { type: String },
    message: { type: String, default: "" },
});

const educationDetailsSchema = new mongoose.Schema({
    name: { type: String },
    degree: { type: String },
    grades: { type: gradesSchema, default: undefined },
    dates: {
        type: {
            startDate: { type: Date, default: undefined },
            endDate: { type: Date, default: undefined },
        },
        default: undefined,
    },
    location: { type: String },
});

const projectsSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    extraDetails: { type: String },
    links: {
        type: [{ link: { type: String } }],
        default: [],
    },
});

const certificationSchema = new mongoose.Schema({
    issuingAuthority: { type: String },
    title: { type: String },
    issueDate: { type: Date, default: undefined },
    link: { type: String },
});

const experienceSchema = new mongoose.Schema({
    companyName: { type: String },
    companyAddress: { type: String },
    position: { type: String },
    dates: {
        type: {
            startDate: { type: Date, default: undefined },
            endDate: { type: Date, default: undefined },
        },
        default: undefined,
    },
    workDescription: { type: String },
});

const resumeSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        resumeTitle: { type: String },
        resumeType: { type: String, enum: ["Classic", "Modern"] },
        personalDetails: { type: personalDetailsSchema },
        educationDetails: {
            type: [educationDetailsSchema],
            default: [{}],
            validate: {
                validator: function (v) {
                    return v.length >= 1;
                },
                message: "At least one education entry is required",
            },
        },
        skills: { type: [{ skillName: String }], default: [] },
        professionalExperience: { type: [experienceSchema] },
        projects: { type: [projectsSchema] },
        otherExperience: { type: [experienceSchema] },
        certifications: { type: [certificationSchema] },
    },
    { timestamps: true }
);


export const Resume = mongoose.model("Resume", resumeSchema);
