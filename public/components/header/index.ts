import { Router } from "@vaadin/router";
import { state } from "../../state";
const logo = require("../../assets/logo.svg");

class headerCustomElement extends HTMLElement {
   connectedCallback() {
      this.render();
   }

   render(): void {
      this.innerHTML = `
         <header class="header-comp">
            <img class="header-comp__logo" src="${logo}">
            <div class="hamburger-menu">
                <i class="hamburger-menu__i"></i>
                <i class="hamburger-menu__i"></i>
                <i class="hamburger-menu__i"></i>
            </div>
         </header>

         <div class="home__menu">
            <div class="home__menu-div-text">
               <p class="home__menu-text">Mis datos</p>
               <p class="home__menu-text">Mis mascotas reportadas</p>
               <p class="home__menu-text">Reportar mascota</p>
            </div>
            <div class="home__menu-div-emial">
               <p class="home__menu-email">pepe@gmail.com</p>
               <p class="home__menu-sign-off">Cerrar sesión</p>
            </div>
         </div>
        `;

      const menuToggleEl = document.querySelector(".hamburger-menu");
      const menuEl = document.querySelector(".home__menu");
      const logoEl = document.querySelector(".header-comp__logo");

      logoEl.addEventListener("click", () => {
         Router.go("/home");
      });

      menuToggleEl.addEventListener("click", () => {
         menuToggleEl.classList.toggle("active");
         menuEl.classList.toggle("active");
      });
   }
}
customElements.define("header-comp", headerCustomElement);
