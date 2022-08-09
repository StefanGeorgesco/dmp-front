import { createRouter, createWebHistory } from "vue-router";
import HomeComponent from "../components/HomeComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import { User } from '../model/user.js';

let user = new User();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeComponent,
    }, {
      path: "/login",
      name: "login",
      component: LoginComponent,
    },
  ],
});

router.beforeEach((to, from, next) => {
  user = JSON.parse(sessionStorage.getItem('userdetails'));

  if (to.name !== 'login' && !user) next({ name: 'login' })
  else next()
})

export default router;
