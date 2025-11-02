import express from "express";
import {
  createMember,
  getMembers,
  getMember,
  updateMember,
  deleteMember,
} from "../controllers/member.controller.js";

const router = express.Router();

router.route("/create-member").post(createMember);
router.route("/delete-member/:id").delete(deleteMember);
router.route("/update-member/:id").put(updateMember);
router.route("/get-member/:id").get(getMember);
router.route("/get-members").get(getMembers);

export default router;
