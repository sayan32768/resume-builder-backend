import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Access token is missing or Invalid"
            })
        }

        const token = authHeader.split(" ")[1]

        jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    return res.status(400).json({
                        success: false,
                        message: "Access token has expired, use refresh token to generate again"
                    })
                }
                return res.status(400).json({
                    success: false,
                    message: "Token verification failed"
                })
            }

            const { id } = decoded;

            const user = await User.findById({ _id: id })

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }
            req.userId = user._id
            next()
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}