import express from "express";
import {
  authenticate,
  authenticateNonStrict,
} from "../middleware/authenticate";
import { catchErrors, catchSynchronousErrors } from "../utils/catchErrors";
import getCardInfo from "../controller/cardInfo/getCardInfo";
import createCard from "../controller/cardInfo/createCard";
import deleteCard from "../controller/cardInfo/deleteCard";
import updateCard from "../controller/cardInfo/updateCard";
import { uploadAvatarImage } from "../controller/cardInfo/uploadCardImage";
import { multerAvatarUpload } from "../config/multer";
import { deleteCardInfoAvatarImage } from "../controller/cardInfo/deleteCardInfoAvatarImage";
import changeCardVisibility from "../controller/cardInfo/changeCardVisibility";

const router = express.Router();

router.get(
  "/:id",
  catchErrors(authenticateNonStrict),
  catchErrors(getCardInfo)
);

router.post(
  "/:id/change-visibility",
  catchErrors(authenticate),
  catchErrors(changeCardVisibility)
);

router.post("/create-card", catchErrors(authenticate), catchErrors(createCard));

router.delete(
  "/:id/avatar/delete",
  catchErrors(authenticate),
  catchErrors(deleteCardInfoAvatarImage)
);
router.post(
  "/:id/avatar/upload",
  catchErrors(authenticate),
  catchSynchronousErrors(multerAvatarUpload.single("avatarImage")),
  catchErrors(uploadAvatarImage)
);

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
