import express from "express";
import { getUser } from "../controller/user/getUser";
import { updateUserData } from "../controller/user/updateUserData";
import { updateUserPassword } from "../controller/user/updateUserPassword";
import { getCards } from "../controller/user/getCards";
import checkToken from "../middleware/checkToken";
import { getMainCard } from "../controller/user/getMainCard";
import { updateMainCard } from "../controller/user/changeMainCard";
import { getUserPrivateData } from "../controller/user/getUserPrivateData";

const router = express.Router();

router.get("/main-card", checkToken, getMainCard);

router.post("/get-cards", checkToken, getCards);
router.post("/get-user-private-data", checkToken, getUserPrivateData);
router.put("/update-user-data", checkToken, updateUserData);
router.put("/update-user-password", updateUserPassword);
router.put("/change-main-card/:id", checkToken, updateMainCard);
router.get("/:id", getUser);

export default router;
