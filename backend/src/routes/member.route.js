import express from "express";
import multer from "multer";
import {
  createMember,
  getMembers,
  getMember,
  updateMember,
  deleteMember,
} from "../controllers/member.controller.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.post("/create-member", upload.single("image"), createMember);
router.put("/update-member/:id", upload.single("image"), updateMember);
router.delete("/delete-member/:id", deleteMember);
router.get("/get-member/:id", getMember);
router.get("/get-members", getMembers);

export default router;
