import express from "express";
import getCardInfo from "../controller/cardInfo/getCardInfo";
import createCard from "../controller/cardInfo/createCard";
import getAllCardInfo from "../controller/cardInfo/getAllCardInfo";
import getMainCardInfo from "../controller/cardInfo/getMainCardInfo";
import deleteCard from "../controller/cardInfo/deleteCard";
import changeMainCard from "../controller/cardInfo/changeMainCard";

const router = express.Router();

router.get("/", getAllCardInfo);
router.get("/main", getMainCardInfo);
router.get("/change-main-card/:id", changeMainCard)
router.get("/:id", getCardInfo);
router.post("/", createCard);
router.delete("/:id", deleteCard);

export default router;
