import express from "express";
import { getUserDetails, loginUser, logoutUser, refreshToken, registerUser, verification } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { userSchema, validateUser } from "../validators/userValidate.js";

const router = express.Router()

router.post('/register', validateUser(userSchema), registerUser)
router.get('/verify', verification)
router.post('/login', loginUser)
router.post('/logout', isAuthenticated, logoutUser)
router.get('/getUserDetails', isAuthenticated, getUserDetails)
router.post('/refresh', refreshToken)

export default router
