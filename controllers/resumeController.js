import { Resume } from "../models/resumeModel.js"

export const create = async (req, res) => {
    try {
        const id = req.userId
        const data = req.body

        const resume = await Resume.create({
            userId: id,
            ...data
        });

        return res.status(201).json({
            success: true,
            message: "Resume Created Successfully",
            data: resume
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some error occurred"
        })
    }
}

export const getPastResumes = async (req, res) => {
    try {
        const id = req.userId;
        const resumes = await Resume.find({ userId: id });

        if (!resumes || resumes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No resumes found for this user",
            });
        }

        res.status(200).json({
            success: true,
            data: resumes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error getting resumes, try again"
        })
    }
}
