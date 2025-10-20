import mongoose from "mongoose";

const linksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    url: {
        type: String,
        required: true,
    }
})

const personalDetailsSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },

    phoneNumber: {
        type: String,
        required: true,
    },

    socials: {
        type: [linksSchema],
        required: true,
    },

    address: {
        type: String,
    },

    about: {
        type: String,
    }
})

const gradesSchema = new mongoose.Schema({

    type: {
        type: String,
        enum: ["Percentage", "CGPA"],
        required: true
    },

    value: {
        type: String,
        required: true
    },

    message: {
        type: String,
        default: null
    }
})

const educationDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    degree: {
        type: String,
        required: true,
    },

    grades: {
        type: gradesSchema,
    },

    startDate: {
        type: Date,
    },

    endDate: {
        type: Date,
    },

    location: {
        type: String
    }
})

const projectsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    extraDetails: {
        type: String,
    },

    links: {
        type: [linksSchema],
    }
})

const certificationSchema = new mongoose.Schema({
    issuingAuthority: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    link: {
        type: String
    }
})

const experienceSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },

    companyAddress: {
        type: String,
    },

    position: {
        type: String,
    },

    startDate: {
        type: Date,
    },

    endDate: {
        type: Date,
    },

    workDescription: {
        type: String,
    }
})

const resumeSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    personalDetails: {
        type: personalDetailsSchema,
        required: true,
    },

    educationDetails: {
        type: [educationDetailsSchema],
        required: true,
    },

    skills: {
        type: [String],
    },

    professionalExperience: {
        type: [experienceSchema],
    },

    projects: {
        type: [projectsSchema],
    },

    otherExperience: {
        type: [experienceSchema]
    },

    certifications: {
        type: [certificationSchema],
    }

}, { timestamps: true })

export const Resume = mongoose.model("Resume", resumeSchema);