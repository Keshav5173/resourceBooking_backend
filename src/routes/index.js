import userRouter from "./user.routes.js";
import express from "express";

const router = express.Router();

router.use("/user", userRouter);

export default router;