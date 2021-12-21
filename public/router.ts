import { Router } from "@vaadin/router";

export function initRouter(rootEl: Element) {
   const router = new Router(rootEl);
   router.setRoutes([
      { path: "/home", component: "home-page" },
      { path: "/login", component: "login-page" },
      { path: "/singup", component: "singup-page" },
      { path: "/verify-email", component: "verify-email-page" },
      { path: "/report-pet", component: "report-pet-page" },
   ]);

   if (location.pathname === "/") {
      Router.go("/home");
   }
}
