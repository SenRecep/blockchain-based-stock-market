import express from "express";
import {
  createAssistant,
  getAllPendingProductsRequest,
  getAllProductsRequest,
  getMoneyRequest,
  updateMoneyVerify,
  updateVerifyRequest,
} from "../controllers/admin.controller.js";
const router = express.Router();

router.route("/").get(getAllPendingProductsRequest).post(createAssistant).put(updateVerifyRequest);
router.route("/all").get(getAllProductsRequest);
router.route("/moneyverify").get(getMoneyRequest).put(updateMoneyVerify);



export default router;
