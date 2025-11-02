// src/controllers/auth.controller.js
import {
	loginSchema,
	signupSchema,
} from "../utils/validation/login.validation.js";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/validation/prismaClient.js";

export const signUpController = async (req, res) => {
	try {
		const parsedData = signupSchema.safeParse(req.body);

		if (!parsedData.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: parsedData.error.errors,
			});
		}

		const { username, email, googleId, image } = parsedData.data;

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ googleId }, { email }],
			},
		});

		if (existingUser) {
			return res.status(400).json({
				message: "User already exists",
			});
		}

		const adminEmail = process.env.ADMIN_EMAIL;
		const role = adminEmail === email ? "ADMIN" : "USER";
		const user = await prisma.user.create({
			data: {
				username,
				email,
				googleId,
				image,
				role,
			},
		});

		if (!user) {
			return res.status(400).json({
				message: "Failed to create user",
			});
		}
		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			process.env.TOKEN_SECRET,
			{
				expiresIn: "7d",
			}
		);

		res.status(201).json({
			message: "User created successfully",
			data: {
				user,
				token,
			},
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const loginController = async (req, res) => {
	try {
		const parsedData = loginSchema.safeParse(req.body);

		if (!parsedData.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: parsedData.error.errors,
			});
		}

		const { email, googleId } = parsedData.data;

		const user = await prisma.user.findFirst({
			where: {
				OR: [{ googleId }, { email }],
			},
		});

		if (!user) {
			return res.status(400).json({
				message: "User not found",
			});
		}

		const tokenSecret = process.env.TOKEN_SECRET;
		if (!tokenSecret) {
			return res.status(500).json({ message: "Token secret not configured" });
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			tokenSecret,
			{ expiresIn: "7d" }
		);

		res.status(200).json({
			message: "Login successful",
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
				image: user.image,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
