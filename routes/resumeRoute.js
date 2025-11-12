import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { create, deleteResume, download, getPastResumes, getResumeById, processResume, updateResume } from "../controllers/resumeController.js";
import { schemaValidator } from "../validators/validator.js";
import { resumeSchema } from "../validators/resumeValidate.js";

import multer from "multer";
const upload = multer();

const router = express.Router()

router.post("/create", isAuthenticated, schemaValidator(resumeSchema), create)
router.get("/all", isAuthenticated, getPastResumes)
router.put("/:id", isAuthenticated, schemaValidator(resumeSchema), updateResume)
router.get("/:id", isAuthenticated, getResumeById);
router.delete("/delete/:id", isAuthenticated, deleteResume);
router.post("/download", isAuthenticated, download);
router.post("/processResume", isAuthenticated, upload.single("resume"), processResume)

export default router
