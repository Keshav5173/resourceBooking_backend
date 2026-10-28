import userRouter from "./user.routes.js";
import resourceRouter from "./resource.routes.js";
import bookingRouter from "./booking.routes.js"
import express from "express";

const router = express.Router();

router.use("/user", userRouter);
router.use("/resource", resourceRouter);
router.use("/booking", bookingRouter);

export default router;