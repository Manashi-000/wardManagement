import { Router } from "express";
import multer from "multer";

import {
	createPost,
	updatePost,
	deletePost,
	getPost,
	getPosts,
} from "../controllers/admin.controller.js";

import {
	getOrganizations,
	getOrganization,
} from "../controllers/organization.controller.js";
import { adminAuthMiddleware } from "../middlewares/user.auth.js";

const router = Router();

router.use(adminAuthMiddleware);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({ storage });

router.get("/getOrganization/:organizationID", getOrganization);
router.get("/get-organizations", getOrganizations);
router.get("/get-post/:postID", getPost);
router.get("/get-posts", getPosts);
router.post("/create-post", upload.array("images"), createPost);
router.put("/update-post/:postID", upload.array("images"), updatePost);
router.delete("/delete-post/:postID", deletePost);

export default router;
