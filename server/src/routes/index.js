import authRoute from "../modules/auth/routers/auth.route.js";
import userRoute from "../modules/auth/routers/user.route.js";
import adminRoute from "../modules/admin/routers/admin.route.js";
import {
  requiredAuthMiddleware,
  requiredRoleMiddleware,
} from "../middlewares/auth.middleware.js";
import { RoleInfo } from "../constants/roleInfo.js";
import productRoute from "../modules/product/routers/product.route.js";
import marketRoute from "../modules/market/routers/market.route.js";
import moneyRequestRoute from "../modules/auth/routers/moneyRequest.route.js";
import swapRequestRoute from "../modules/swapRequest/routers/swapRequest.route.js";
import blockchainRoute from "../modules/blockchain/routes/blockchain.route.js";

export const useRoutes = (app) => {
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/admin",requiredAuthMiddleware,
  requiredRoleMiddleware([RoleInfo.admin]), adminRoute);
  app.use("/api/products", productRoute);
  app.use("/api/market", marketRoute);
  app.use("/api/moneyrequest", moneyRequestRoute);
  app.use("/api/swaprequest", swapRequestRoute);
  app.use("/api/blockchain", blockchainRoute);
};
