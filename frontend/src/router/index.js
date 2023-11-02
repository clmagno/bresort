import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import login from "../components/auth/Login.vue";
import Main from "../components/main/MainComponent.vue";
import Booking from "../components/main/BookingComponent.vue";
import Cashier from "../components/main/CashierComponent.vue";
import Inventory from "../components/main/InventoryComponent.vue";
import ExpiredPage from "../components/main/ExpiredPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: login,
    },
    {
      path: "/main",
      name: "main",
      component: Main,
      meta: { requiresAuth: true },
    },
    {
      path: "/booking",
      name: "booking",
      component: Booking,     
      meta: { requiresAuth: true },
    },    
    {
      path: "/cashier",
      name: "cashier",
      component: Cashier,
      meta: { requiresAuth: true },
    },
    {
      path: "/inventory",
      name: "inventory",
      component: Inventory,
      meta: { requiresAuth: true },
    },        
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Access the authStore
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" }); // redirect to login if not authenticated
  } else if (to.path === "/" && authStore.isAuthenticated) {
    next({ name: from.name || "booking" }); // redirect to main if already authenticated and trying to access login page
  } else {
    next();
  }
});


export default router;
