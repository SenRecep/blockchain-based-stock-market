import { Roles } from "@/constants/roles.constant";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    name: "product-verify",
    path: "/products/verify",
    meta: { requiresAuth: true, roles: [Roles.admin] },
    component: () => import("@/modules/admin/views/ProductList.vue"),
  },
];

export default routes;
