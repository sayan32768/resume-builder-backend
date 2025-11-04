import { Resume } from "../models/resumeModel.js"
import puppeteer from "puppeteer";

export const create = async (req, res) => {
    try {
        const id = req.userId
        const data = req.body

        // console.log(data)

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
        const resumes = await Resume.find({ userId: id }, { _id: 1, resumeTitle: 1, resumeType: 1, updatedAt: 1 }).sort({ updatedAt: -1 });

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

export const updateResume = async (req, res) => {
    try {
        const id = req.userId

        const resumeId = req.params.id

        const data = req.body

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "Could not get data"
            })
        }

        if (!resumeId) {
            return res.status(400).json({
                success: false,
                message: "Could not find resume"
            })
        }

        const updated = await Resume.findOneAndUpdate(
            {
                _id: resumeId, userId: id
            },
            data,
            { new: true }
        )

        if (!updated)
            return res.status(404).json({ success: false, message: "Resume not found" });

        res.status(200).json({ success: true, data: updated });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating resume"
        })
    }
}

export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId }).select("-_id -userId -__v -createdAt -updatedAt");
        if (!resume)
            return res.status(404).json({ success: false, message: "Resume not found" });
        console.log(resume);

        res.status(200).json({ success: true, data: resume });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching resume" });
    }
}

export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const resume = await Resume.findOne({ _id: id, userId });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found or you are not authorized",
            });
        }

        await Resume.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete resume, try again",
        });
    }
};

export const download = async (req, res) => {
    try {
        const { htmlContent } = req.body;

        console.log(puppeteer.executablePath())
        const browser = await puppeteer.launch({
            executablePath: puppeteer.executablePath(),
            headless: true,
            args: process.env.NODE_ENV === 'production' ? ['--no-sandbox', '--disable-setuid-sandbox', '--single-process', '--no-zygote'] : [],
        });

        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        await page.addStyleTag({
            content: `
                * {
                    margin: 0
                }
            `
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        res.setHeader("Content-Disposition", "attachment; filename=code.pdf");
        res.setHeader("Content-Type", "application/pdf");
        res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating PDF");
    }
};
