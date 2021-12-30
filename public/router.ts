import { Router } from "@vaadin/router";

export function initRouter(rootEl: Element) {
   const router = new Router(rootEl);
   router.setRoutes([
      { path: "/home", component: "home-page" },
      { path: "/my-data", component: "my-data-page" },
      { path: "/verify-email", component: "verify-email-page" },
      { path: "/login", component: "login-page" },
      { path: "/report-pet", component: "report-pet-page" },
      { path: "/my-pets", component: "my-pets-page" },
   ]);

   if (location.pathname === "/") {
      Router.go("/home");
   }
}
