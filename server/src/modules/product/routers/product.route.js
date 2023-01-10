import express from "express";
import controller from "../controllers/product.controller.js";
const router = express.Router();
import { upload } from "../middlewares/image.middleware.js";
import { productValidator } from "../validators/productValidator.js";

router
  .route("/")
  .post(productValidator, upload.single("images"), controller.postRequest)
  .put(upload.any(),controller.updateProductRequest);

router.route("/user").get(controller.getUserProductsRequest);
router.route("/user/pending").get(controller.getUserPendingProductsRequest);

router.route("/:id").get(controller.getByIdRequest);
export default router;


/** 
 * para ekleme
 * admine pra ekleme isteği eklenince true olacak ve ekranda gözükmeyecek
 */