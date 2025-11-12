import { Resume } from "../models/resumeModel.js"
import puppeteer from "puppeteer";
import axios from "axios";

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

export const processResume = async (req, res) => {

    console.log("HEYEYE")

    try {
        const pdf = req.file;
        if (!pdf) {
            return res.status(400).send({
                error: "No file uploaded",
                message: "Please upload a PDF file"
            });
        }

        if (pdf.mimetype !== "application/pdf") {
            return res.status(400).send({
                error: "Invalid file type",
                message: "Uploaded file must be a PDF"
            });
        }

        const FormData = (await import('form-data')).default;
        const formData = new FormData();
        formData.append("pdf", pdf.buffer, {
            filename: pdf.originalname,
            contentType: "application/pdf"
        });

        const response = await axios.post(
            `${process.env.NODE_ENV === 'production' ? process.env.BASE_URL_AI : "http://localhost:8000"}/process`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    "secret": process.env.FASTAPI_INTERNAL_SECRET
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                validateStatus: () => true,
            }
        );

        if (response.status >= 400) {
            return res.status(response.status).send({
                error: "Resume processing failed",
                fastapi_error: response.data
            });
        }

        return res.status(200).send({
            success: true,
            resume: response.data
        });

    } catch (error) {
        console.error(error);

        return res.status(500).send({
            error: "Node server error",
            message: "Failed to process resume",
            details: error.message
        });
    }
};
