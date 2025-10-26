import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { create, getPastResumes } from "../controllers/resumeController.js";
import { schemaValidator } from "../validators/validator.js";
import { resumeSchema } from "../validators/resumeValidate.js";

const router = express.Router()

router.post("/create", isAuthenticated, schemaValidator(resumeSchema), create)
router.get("/all", isAuthenticated, getPastResumes)

export default router