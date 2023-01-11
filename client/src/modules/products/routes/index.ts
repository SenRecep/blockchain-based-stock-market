import { Roles } from "@/constants/roles.constant";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    name: "product-create",
    path: "/product/create",
    meta: { requiresAuth: true },
    component: () => import("@/modules/products/views/ProductCreate.vue"),
  },
  {
    name: "product-list",
    path: "/product/list",
    meta: { requiresAuth: true },
    component: () => import("@/modules/products/views/ProductList.vue"),
  },
];

export default routes;
