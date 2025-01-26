import express from "express";
import getCardInfo from "../controller/cardInfo/getCardInfo";
import createCard from "../controller/cardInfo/createCard";
import getAllCardInfo from "../controller/cardInfo/getAllCardInfo";
import getMainCardInfo from "../controller/cardInfo/getMainCardInfo";

const router = express.Router();

router.get("/", getAllCardInfo);
router.get("/main", getMainCardInfo);
router.get("/:id", getCardInfo);
router.post("/", createCard);

export default router;
