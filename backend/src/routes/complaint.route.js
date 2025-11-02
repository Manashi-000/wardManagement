import { Router } from "express";
import multer from "multer";
import {
  createComplaints,
  updateComplaints,
  deleteComplaints,
  adminRespondToComplaint,
  getComplaint,
  getComplaints,
} from "../controllers/complaint.controller.js";
// configure multer (store files in "uploads/" folder)
const upload = multer({ dest: "uploads/" });
const router = Router()
router.post("/create-complaints/", upload.array("images", 5), createComplaints);
router.put("/update-complaints/:complaintID", updateComplaints);
router.delete("/delete-complaints/:complaintID", deleteComplaints);
router.get("/get-complaint/:complaintID", getComplaint);
router.get("/get-complaints", getComplaints);
router.put("/:complaintID/respond", adminRespondToComplaint);

export default router;