// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "@/auth/auth";
import Login from "@/auth/login.vue";
import Forum from "@/components/DomForum.vue";
import Home from "@/components/Home.vue";
import Profile from "@/components/Profile.vue";
import Profiles from "@/components/Profiles.vue";
import Settings from "@/components/Settings.vue";
import Errors from "@/errors/Error.vue";
import store from "@/store";
import PageGroupe from "@/components/PageGroupe.vue";

const routes = [
  {
    path: '/profile',
    name: "Profile",
    component: Profile,
  },
  {
    path: '/profiles',
    name: "Profiles",
    component: Profiles,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/forum",
    name: "Forum",
    component: Forum,
  },
  {
    path:"/groups",
    name: "Groups",
    component: PageGroupe
  },
  {
    path: "/errors",
    name: "Errors",
    component: Errors,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


// Verification de la presence du token
router.beforeEach((to, _, next) => {
   // Vérifie si l'utilisateur est authentifié
   const isAuth = isAuthenticated();
   // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié et n'est pas sur la page de connexion ou la page d'accueil
   if (!isAuth && to.name !== "Login" && to.name !== "Home") {
     store.dispatch("disconnect"); // Débute la déconnexion
     next({ name: "Login" }); // Redirige vers la page de connexion
   } else {
     // Si l'utilisateur est authentifié, met à jour l'état de connexion dans le store
     if (isAuth) {
       store.commit('setIsLogin', true);
     }
     next(); // Continue vers la route demandée
   }
});


export default router;
