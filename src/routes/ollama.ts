import express from "express";
import { catchErrors } from "../utils/catchErrors";
import chat from "../controller/ollama/embed";

const router = express.Router();

router.post("/embed", catchErrors(chat));

export default router;
