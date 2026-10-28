import express from "express";

import { 
    createBooking,
    getBookingHistory,
    getBookingStats    
 } from "../controller/booking.controller.js";
import { verifyAdminJWT, VerifyUserJWT } from "../middleware/auth.middleware.js";

 const router = express.Router();

 router.post("/createBooking", VerifyUserJWT, createBooking);
 router.get("/getBookingHistory", VerifyUserJWT, getBookingHistory);
 router.get("/getBookingStats", verifyAdminJWT, getBookingStats);
 

export default router;