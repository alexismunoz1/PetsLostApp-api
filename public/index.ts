import { initRouter } from "./router";
import { state } from "./state";

// Components
import "./components/header";
import "./components/input/";
import "./components/button";

// Pages
import "./pages/home/index";
import "./pages/mydata/index";
import "./pages/verify-email/index";
import "./pages/login/index";
import "./pages/report-pet/index";

(function main() {
   const rootEl = document.querySelector(".root");
   initRouter(rootEl);
   state.initLocalStorage();
})();
