import express from "express";
import moneyRequestContoller from "../controllers/moneyRequest.contoller.js";
const router = express.Router();

router.route("/").post(moneyRequestContoller.postRequest);

export default router;
