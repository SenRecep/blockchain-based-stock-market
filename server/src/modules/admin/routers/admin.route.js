import express from "express";
import {
  createAssistant,
  getAllPendingProductsRequest,
  getAllProductsRequest,
  updateVerifyRequest,
} from "../controllers/admin.controller.js";
const router = express.Router();

router.route("/").get(getAllPendingProductsRequest).post(createAssistant).put(updateVerifyRequest);
router.route("/all").get(getAllProductsRequest);


export default router;
