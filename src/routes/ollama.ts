import express from "express";
import { catchErrors } from "../utils/catchErrors";
import chat from "../controller/ollama/embed";
import { authenticate } from "../middleware/authenticate";
import rewriteCardDescription from "../controller/ollama/rewriteCardDescription";

const router = express.Router();

router.post("/embed", catchErrors(chat));
router.post(
  "/rewrite-card-description",
  catchErrors(authenticate),
  catchErrors(rewriteCardDescription)
);

export default router;
