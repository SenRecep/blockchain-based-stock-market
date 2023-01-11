import express from "express";
import controller from "../controller/swapRequest.controller.js";
const router = express.Router();

router.route("/").get(controller.getRequest).post(controller.postRequest);

router
  .route("/getfrom")
  .get(controller.getFromRequest);

router
  .route("/getto")
  .get(controller.getToRequest);

  router
  .route("/getfromnotverified")
  .get(controller.getFromNotVerifiedRequest).put(controller.verifyRequest);

router
  .route("/gettonotverified")
  .get(controller.getToNotVerifiedRequest).put(controller.verifyRequest);

export default router;
