import express from "express";
import {
    createResource,
    getResourcesWithBookedDates
} from "../controller/resource.controller.js";
import { verifyAdminJWT, VerifyUserJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createResource", verifyAdminJWT, createResource);
router.get("/getResources", VerifyUserJWT, getResourcesWithBookedDates);


export default router;