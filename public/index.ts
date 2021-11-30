import { initRouter } from "./router";

// Pages
import "./pages/welcome/index";
import "./pages/singup/index";
import "./pages/login/index";
import "./pages/home/index";

// Components
import "./components/input/";
import "./components/button";

(function main() {
   const rootEl = document.querySelector(".root");
   initRouter(rootEl);
})();
