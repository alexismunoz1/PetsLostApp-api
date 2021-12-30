import { initRouter } from "./router";
import { state } from "./state";

// Components
import "./components/header";
import "./components/input/";
import "./components/button";
import "./components/pet-card";

// Pages
import "./pages/home/index";
import "./pages/my-data/index";
import "./pages/verify-email/index";
import "./pages/login/index";
import "./pages/report-pet/index";
import "./pages/my-pets/index";

(function main() {
   state.initLocalStorage();
   const rootEl = document.querySelector(".root");
   initRouter(rootEl);
})();
