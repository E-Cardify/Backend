import express from "express";
import getCardInfo from "../controller/cardInfo/getCardInfo";
import createCard from "../controller/cardInfo/createCard";
import deleteCard from "../controller/cardInfo/deleteCard";
import checkToken from "../middleware/checkToken";
import updateCard from "../controller/cardInfo/updateCard";

const router = express.Router();

router.get("/:id", getCardInfo);

router.post("/create-card", checkToken, createCard);

router.delete("/delete-card/:id", checkToken, deleteCard);

router.put("/update-card/:id", checkToken, updateCard);

export default router;
