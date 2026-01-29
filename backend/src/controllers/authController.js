import jwt from "jsonwebtoken"
import User from "../models/User.js"

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	})
}

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body

		const userExists = await User.findOne({ email })
		if (userExists) {
			return res.status(400).json({
				success: false,
				message: "User already exists with this email",
			})
		}

		const user = await User.create({ name, email, password })
		const token = generateToken(user._id)

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
		})
	} catch (error) {
		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map((err) => err.message)
			return res.status(400).json({
				success: false,
				message: messages.join(", "),
			})
		}

		res.status(500).json({
			success: false,
			message: "Error registering user",
			error: error.message,
		})
	}
}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide email and password",
			})
		}

		const user = await User.findOne({ email }).select("+password")
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			})
		}

		const isMatch = await user.matchPassword(password)
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			})
		}

		const token = generateToken(user._id)

		res.json({
			success: true,
			message: "Login successful",
			data: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error logging in",
			error: error.message,
		})
	}
}
