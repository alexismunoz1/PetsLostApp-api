import { initRouter } from "./router";

// Pages
import "./pages/home/index";
import "./pages/verify-email/index";
import "./pages/login/index";
import "./pages/singup/index";
import "./pages/report-pet/index";

// Components
import "./components/input/";
import "./components/button";

(function main() {
   const rootEl = document.querySelector(".root");
   initRouter(rootEl);
})();
