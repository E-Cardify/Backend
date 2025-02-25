import express from "express";
import { getUser } from "../controller/user/getUser";
import { updateUserData } from "../controller/user/updateUserData";
import { updateUserPassword } from "../controller/user/updateUserPassword";
import { getCards } from "../controller/user/getCards";

const router = express.Router();

router.post("/get-cards", getCards);

router.put("/update-user-data", updateUserData);
router.put("/update-user-password", updateUserPassword);

router.get("/:id", getUser);

export default router;
