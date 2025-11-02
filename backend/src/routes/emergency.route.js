import { Router } from "express";
import { createEmergency,getEmergencies,getEmergency,updateEmergency,deleteEmergency} from "../controllers/emergency.controller.js";
const router = Router()

import multer from "multer";
import path from "path";

// storage config (uploads/ folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});

const upload = multer({ storage });

// route for uploading icon
router.post("/upload-icon", upload.single("icon"), (req, res) => {
  const fileUrl = `http://localhost:8000/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

router.route("/create-emergency").post(createEmergency)
router.route("/delete-emergency/:emergencyID").delete(deleteEmergency)
router.route("/update-emergency/:emergencyID").put(updateEmergency)
router.route("/get-emergency/:emergencyID").get(getEmergency)
router.route("/get-emergencies").get(getEmergencies)


export default router