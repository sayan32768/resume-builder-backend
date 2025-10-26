import express from "express";
import { getUserDetails, loginUser, logoutUser, refreshToken, registerUser, verification } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { userSchema } from "../validators/userValidate.js";
import { schemaValidator } from "../validators/validator.js";

const router = express.Router()

router.post('/register', schemaValidator(userSchema), registerUser)
router.post('/verify', verification)
router.post('/login', loginUser)
router.post('/logout', isAuthenticated, logoutUser)
router.get('/getUserDetails', isAuthenticated, getUserDetails)
router.post('/refresh', refreshToken)

export default router
