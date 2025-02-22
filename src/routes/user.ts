import express from "express";
import login from "../controller/account/login";
import register from "../controller/account/register";
import verify from "../controller/account/verify";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify/:token", verify);

export default router;
