import authRoute from "../modules/auth/routers/auth.route.js";
import userRoute from "../modules/auth/routers/user.route.js";
import adminRoute from "../modules/admin/routers/admin.route.js";
import {
  requiredAuthMiddleware,
  requiredRoleMiddleware,
} from "../middlewares/auth.middleware.js";
import { RoleInfo } from "../constants/roleInfo.js";

export const useRoutes = (app) => {
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use(
    "/api/admin",
    requiredAuthMiddleware,
    requiredRoleMiddleware([RoleInfo.admin]),
    adminRoute
  );
};
