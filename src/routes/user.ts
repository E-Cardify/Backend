import express from "express";
import { updateUserData } from "../controller/user/updateUserData";
import { updateUserPassword } from "../controller/user/updateUserPassword";
import { getCards } from "../controller/user/getCards";
import { getMainCard } from "../controller/user/getMainCard";
import { updateMainCard } from "../controller/user/changeMainCard";
import { getUserPrivateData } from "../controller/user/getUserPrivateData";
import { catchErrors, catchSynchronousErrors } from "../utils/catchErrors";
import { getLogs } from "../controller/user/getLogs";
import { NOT_FOUND } from "../constants/http";
import { deleteAvatarImage } from "../controller/user/deleteAvatarImage";
import { multerAvatarUpload } from "../config/multer";
import { uploadAvatarImage } from "../controller/user/uploadAvatarImage";

const router = express.Router();

router.post(
  "/avatar/upload",
  catchSynchronousErrors(multerAvatarUpload.single("avatarImage")),
  catchErrors(uploadAvatarImage)
);
router.delete("/avatar/delete", catchErrors(deleteAvatarImage));

router.get("/main-card", catchErrors(getMainCard));
router.get("/get-cards", catchErrors(getCards));
router.post("/get-logs", catchErrors(getLogs));
router.get("/get-user-private-data", catchErrors(getUserPrivateData));
router.get("/me", catchErrors(getUserPrivateData)); // same as get-user-private-data

router.patch("/change-main-card/:id", catchErrors(updateMainCard));
router.patch("/update-user-data", catchErrors(updateUserData));
router.patch("/update-user-password", catchErrors(updateUserPassword));
router.get("/:id", (_req, res) => {
  res.status(NOT_FOUND).json({ message: "Not found" });
});

export default router;
