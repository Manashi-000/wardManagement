import { Router } from "express";
import {
  createComplaints,
  updateComplaints,
  deleteComplaints,
  adminRespondToComplaint,
  getComplaint,
  getComplaints,
  getActiveComplaintCount,
} from "../controllers/complaint.controller.js";
import { adminAuthMiddleware, userAuthMiddleware } from "../middlewares/user.auth.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router()
router.post("/create-complaints/", upload.array("images", 5), createComplaints);
router.put("/update-complaints/:complaintID", userAuthMiddleware, updateComplaints);
router.delete("/delete-complaints/:complaintID", userAuthMiddleware, deleteComplaints);
router.get("/get-complaint/:complaintID", getComplaint);
router.get("/get-complaints", getComplaints);
router.put("/:complaintID/respond", adminAuthMiddleware, adminRespondToComplaint);
router.get("/count", adminAuthMiddleware, getActiveComplaintCount);
export default router;