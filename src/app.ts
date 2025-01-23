import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cardInfo from "./routes/cardInfo";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/card-info", cardInfo);
app.set("trust proxy", true);

export default app;
