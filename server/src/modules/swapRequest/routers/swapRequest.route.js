import express from "express";
import controller from "../controller/swapRequest.controller.js";
const router = express.Router();

router.route("/").post(controller.postRequest);

router
  .route("/getfrom")
  .get(controller.getFromRequest);

router
  .route("/getto")
  .get(controller.getToRequest);

  router
  .route("/getfromnotverified")
  .get(controller.getFromNotVerifiedRequest,);

router
  .route("/gettonotverified")
  .get(controller.getToNotVerifiedRequest);

export default router;
