import express from "express";
import { forgetPassword, resetPassword, sendOTP, signUp, signin } from "../controller/user";
import { auth } from "../middleware/auth"

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signin);

router.post("/forget-password", forgetPassword);

router.post("/reset-password", auth, resetPassword);

router.post("/sendotp", sendOTP);

router.post("/cookies", (req, res) => {
    res.cookie("auth", "hello cookies");
    res.send("cookies sent...");
})


export default router;