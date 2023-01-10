import express from "express";
import {
  addPortRequest,
  removePortRequest,
  getPortRequest,
} from "../controllers/blockchain.controller.js";
const router = express.Router();

router.route("/").get(getPortRequest);
router.route("/:port").post(addPortRequest).delete(removePortRequest);

export default router;
