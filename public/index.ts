import { initRouter } from "./router";
import { state } from "./state";

// Pages
import "./pages/home/index";
import "./pages/mydata/index";
import "./pages/verify-email/index";
import "./pages/login/index";
import "./pages/singup/index";
import "./pages/report-pet/index";

// Components
import "./components/input/";
import "./components/button";
import "./components/header";

(function main() {
   const rootEl = document.querySelector(".root");
   initRouter(rootEl);
})();
