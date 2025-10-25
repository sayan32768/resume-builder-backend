import mongoose from "mongoose";

const linksSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["LINKEDIN", "INSTAGRAM", "GITHUB"],
        required: true,
    },

    link: {
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

    phone: {
        type: String,
        required: true,
    },

    socials: {
        type: [linksSchema],
        default: [],
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
    },

    score: {
        type: String,
    },

    message: {
        type: String,
        default: ""
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
        default: undefined
    },

    dates: {
        type: {
            startDate: {
                type: Date,
                default: undefined
            },

            endDate: {
                type: Date,
                default: undefined
            },
        },
        default: undefined
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
        type: [{
            link: {
                type: String,
                required: true
            }
        }],
        default: []
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

    issueDate: {
        type: Date,
        default: undefined
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

    dates: {
        type: {
            startDate: {
                type: Date,
                default: undefined
            },

            endDate: {
                type: Date,
                default: undefined
            },
        },
        default: undefined
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
        validate: [arr => arr.length > 0, "At least one education is required"]
    },

    skills: {
        type: [{
            skillName: String
        }],
        default: []
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