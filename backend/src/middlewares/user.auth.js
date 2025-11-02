import jwt from "jsonwebtoken";
import { prisma } from "../utils/validation/prismaClient.js";

export const userAuthMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

	const token = authHeader.split(" ")[1];
	console.log("SECRET", process.env.TOKEN_SECRET);
	const tokenSecret = process.env.TOKEN_SECRET;
	if (!tokenSecret) {
		return res.status(500).json({ message: "Token secret not configured" });
	}
	try {
		const decoded = jwt.verify(token, tokenSecret);
		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		});
		if (!user) {
			res.status(400).json({ message: "user not found" });
			return;
		}
		if (user.role !== "USER" && user.role !== "ADMIN") {
			res.status(403).json({ message: "Forbidden: Users only" });
			return;
		}
		req.user = user;
		next();
	} catch {
		res.status(401).json({ message: "Invalid token" });
	}
};

export const adminAuthMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

	const token = authHeader.split(" ")[1];
	console.log("SECRET", process.env.TOKEN_SECRET);
	const tokenSecret = process.env.TOKEN_SECRET;
	if (!tokenSecret) {
		return res.status(500).json({ message: "Token secret not configured" });
	}
	try {
		const decoded = jwt.verify(token, tokenSecret);
		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		});
		if (!user) {
			res.status(400).json({ message: "user not found" });
			return;
		}
		if (user.role !== "ADMIN") {
			res.status(403).json({ message: "Forbidden: Admins only" });
			return;
		}
		req.user = user;
		next();
	} catch {
		res.status(401).json({ message: "Invalid token" });
	}
};
