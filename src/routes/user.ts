import express from "express";
import { getUser } from "../controller/user/getUser";
import { updateUserData } from "../controller/user/updateUserData";
import { updateUserPassword } from "../controller/user/updateUserPassword";

const router = express.Router();

router.get("/:id", getUser);

router.put("/update-user-data", updateUserData);
router.put("/update-user-password", updateUserPassword);

export default router;
