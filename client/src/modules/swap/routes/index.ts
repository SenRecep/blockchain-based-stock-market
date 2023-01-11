import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    name: "product-create",
    path: "/product/create",
    meta: { requiresAuth: true },
    component: () => import("@/modules/products/views/ProductCreate.vue"),
  },
];

export default routes;
