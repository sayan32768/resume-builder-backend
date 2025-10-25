import { verifyMail } from "../emailVerify/verifyMail.js"
import { Session } from "../models/sessionModel.js"
import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Controller for registering a new user into the Database
export const registerUser = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body

        if (!fullName || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // Create hashed password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Finally create the new user if it passes above checks
        const newUser = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "10m" })

        // Send the verification mail
        verifyMail(token, email)

        newUser.token = token

        await newUser.save()

        return res.status(201).json({
            success: true,
            message: 'Verification Email is sent. Please follow the steps mentioned in the email',
            data: newUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Controller for verification of the user using jwt
export const verification = async (req, res) => {
    try {
        // if (!authHeader || !authHeader.startsWith("Bearer ")) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Authorization token is missing or invalid"
        //     })
        // }

        // const token = authHeader.split(" ")[1]

        const token = req.query.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is missing",
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: "Token verification failed"
            })
        }
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.token = null;
        user.isVerified = true;
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    console.log("HERE")
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You must register first before logging in"
            })
        }

        const passwordCheck = await bcrypt.compare(password, user.password)

        if (!passwordCheck) {
            return res.status(402).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your account first"
            })
        }

        // Check for existing session and delete it
        const existingSession = await Session.findOne({ userId: user._id })

        if (existingSession) {
            await Session.deleteOne({ userId: user._id })
        }

        // Create a new session
        await Session.create({ userId: user._id })

        // Generate the access token
        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" })

        // Generate the refresh token
        const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" })

        user.isLoggedIn = true;

        await user.save()

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: `Welcome back ${user.username}`,
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;

        await Session.deleteMany({ userId })

        await User.findByIdAndUpdate(userId, { isLoggedIn: false })

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// export const forgotPassword = async (req, res) => {
//     try {

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

export const getUserDetails = async (req, res) => {
    // console.log("SSSSSSSSSS")
    try {
        const user = await User.findById({ _id: req.userId })
        return res.status(200).json({
            success: true,
            user: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Some error occurred"
        });
    }
}

export const refreshToken = async (req, res) => {
    try {
        // console.log("SS")
        const refreshToken = req.cookies.refresh_token;
        // console.log(refreshToken)
        if (!refreshToken) return res.status(403).json({ success: false, message: "No refresh token" });

        const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);

        const session = await Session.findOne({ userId: decoded.id });
        if (!session) return res.status(403).json({ success: false, message: "Invalid session" });

        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
        });

        res.json({ success: true });
    } catch (error) {
        return res.status(403).json({ success: false, message: "Refresh failed" });
    }
};
