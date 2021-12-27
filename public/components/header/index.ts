import { Router } from "@vaadin/router";
import { state } from "../../state";

const logo = require("../../assets/logo.svg");

class headerCustomElement extends HTMLElement {
   connectedCallback() {
      this.render();
   }

   render(): void {
      const currentState = state.getState();
      let email = "";
      let closeSession = "";
      console.log(currentState);

      if (currentState.user.email) {
         email = currentState.user.email;
         closeSession = "Cerrar sesión";
      }

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
               <p class="home__menu-text mis-datos">Mis datos</p>
               <p class="home__menu-text mis-mascotas">Mis mascotas reportadas</p>
               <p class="home__menu-text reportar-mascota">Reportar mascota</p>
            </div>
            <div class="home__menu-div-emial">
               <p class="home__menu-email">${email}</p>
               <p class="home__menu-sign-off">${closeSession}</p>
            </div>
         </div>
        `;

      const menuToggleEl = document.querySelector(".hamburger-menu");
      const menuEl = document.querySelector(".home__menu");
      const logoEl = document.querySelector(".header-comp__logo");
      const textEl = document.querySelectorAll(".home__menu-text");

      logoEl.addEventListener("click", () => {
         Router.go("/home");
      });

      menuToggleEl.addEventListener("click", () => {
         menuToggleEl.classList.toggle("active");
         menuEl.classList.toggle("active");
      });

      textEl.forEach((element) => {
         element.addEventListener("click", (e) => {
            menuToggleEl.classList.toggle("active");
            menuEl.classList.toggle("active");
         });
      });

      const misDatosEl = document.querySelector(".mis-datos");
      const misMascotasEl = document.querySelector(".mis-mascotas");
      const reportarMascotaEl = document.querySelector(".reportar-mascota");

      misDatosEl.addEventListener("click", () => {
         const currentState = state.getState();

         if (currentState.user.token) {
            Router.go("/my-data");
         } else {
            Router.go("/verify-email");
         }
      });
   }
}
customElements.define("header-comp", headerCustomElement);
