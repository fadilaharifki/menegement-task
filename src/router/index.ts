import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import Home from "../pages/Home.vue";
import About from "../pages/Kanban.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", component: Home },
      { path: "about", component: About },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
