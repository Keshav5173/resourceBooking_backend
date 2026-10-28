import {
    registerUser,
    LoginUser,
    logoutUser,
    viewProfile,
    refreshAccessToken
} from "../controller/user.controller.js";

import { VerifyUserJWT, verifyAdminJWT } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.post("/logout", VerifyUserJWT, logoutUser);
router.get("/profile", VerifyUserJWT, viewProfile);
router.post("/refresh-token", refreshAccessToken);

export default router;
