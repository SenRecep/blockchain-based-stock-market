import { Roles } from "@/constants/roles.constant";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    name: "swap",
    path: "/swap/:marketItemId",
    meta: { requiresAuth: true },
    component: () => import("@/modules/swap/views/Index.vue"),
  },
  {
    name: "requests",
    path: "/requests",
    meta: { requiresAuth: true },
    component: () => import("@/modules/swap/views/Requests.vue"),
  },
];

export default routes;
