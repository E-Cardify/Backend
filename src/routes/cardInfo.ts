import express from "express";
import { authenticate } from "../middleware/authenticate";
import { catchErrors } from "../utils/catchErrors";
import getCardInfo from "../controller/cardInfo/getCardInfo";
import createCard from "../controller/cardInfo/createCard";
import deleteCard from "../controller/cardInfo/deleteCard";
// import checkToken from "../middleware/checkToken";
import updateCard from "../controller/cardInfo/updateCard";

const router = express.Router();

router.get("/:id", catchErrors(getCardInfo));

router.post("/create-card", catchErrors(authenticate), catchErrors(createCard));

router.delete(
  "/delete-card/:id",
  catchErrors(authenticate),
  catchErrors(deleteCard)
);

router.put(
  "/update-card/:id",
  catchErrors(authenticate),
  catchErrors(updateCard)
);

export default router;
