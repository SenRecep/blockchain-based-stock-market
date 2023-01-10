import express from "express";
import controller from "../controllers//market.controller.js";
const router = express.Router();

router
  .route("/")
  .get(controller.getOtherMarketItemsRequest)
  .post(controller.postRequest);

router.route("/user").get(controller.getUserMarketItemsRequest)
.delete(controller.deleteMarketItemsRequest);

router.route("/:id").get(controller.getByIdRequest);
export default router;
