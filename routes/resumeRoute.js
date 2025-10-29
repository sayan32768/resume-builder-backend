import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { create, deleteResume, download, getPastResumes, getResumeById, updateResume } from "../controllers/resumeController.js";
import { schemaValidator } from "../validators/validator.js";
import { resumeSchema } from "../validators/resumeValidate.js";

const router = express.Router()

router.post("/create", isAuthenticated, schemaValidator(resumeSchema), create)
router.get("/all", isAuthenticated, getPastResumes)
router.put("/:id", isAuthenticated, schemaValidator(resumeSchema), updateResume)
router.get("/:id", isAuthenticated, getResumeById);
router.delete("/delete/:id", isAuthenticated, deleteResume);
router.post("/download", isAuthenticated, download);

export default router