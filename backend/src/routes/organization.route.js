import { Router } from "express";
import { updateOrganization,createBudgetForOrganization,createEventsForOrganization,getEventFromOrganization,getEventsFromOrganization, createOrganiation, createPoliciesForOrganization,getPolicyFromOrganization,getPoliciesFromOrganization,deleteBudgetFromOrganization, deleteEventsFromOrganization, deleteOrganization, deletePoliciesFromOrganization, getOrganization, getOrganizations, updateBudgetFromOrganization, updateEventsFromOrganization, updatePoliciesFromOrganization, getBudgetFromOrganization,getBudgetsFromOrganization} from "../controllers/organization.controller.js";
import {userAuthMiddleware,adminAuthMiddleware} from "../middlewares/user.auth.js";

const router = Router()

router.route("/getOrganization/:organizationID").get(getOrganization)
router.route("/get-organizations").get(getOrganizations)

router.route("/create-organization").post(adminAuthMiddleware,createOrganiation)
router.route("/delete-organization/:organizationID").delete(adminAuthMiddleware,deleteOrganization)
router.route("/update-organization/:organizationID").put(adminAuthMiddleware,updateOrganization);


router.route("/organization/create-event").post(adminAuthMiddleware,createEventsForOrganization)
router.route("/organization/delete-event/:eventID").delete(adminAuthMiddleware,deleteEventsFromOrganization)
router.route("/organization/update-event/:eventID").put(adminAuthMiddleware,updateEventsFromOrganization)
router.route("/organization/get-event/:eventID").get(getEventFromOrganization)
router.route("/organization/get-events").get(getEventsFromOrganization)

router.route("/organization/create-policies").post(adminAuthMiddleware,createPoliciesForOrganization)
router.route("/organization/delete-policies/:policyID").delete(adminAuthMiddleware,deletePoliciesFromOrganization)
router.route("/organization/update-policies/:policyID").put(adminAuthMiddleware,updatePoliciesFromOrganization)
router.route("/organization/get-policy/:policyID").get(getPolicyFromOrganization)
router.route("/organization/get-policies").get(getPoliciesFromOrganization)

router.route("/organization/create-budget").post(adminAuthMiddleware,createBudgetForOrganization)
router.route("/organization/delete-budget/:budgetID").delete(adminAuthMiddleware,deleteBudgetFromOrganization)
router.route("/organization/update-budget/:budgetID").put(adminAuthMiddleware,updateBudgetFromOrganization)
router.route("/organization/get-budget/:budgetID").get(getBudgetFromOrganization)
router.route("/organization/get-budgets").get(getBudgetsFromOrganization)



export default router