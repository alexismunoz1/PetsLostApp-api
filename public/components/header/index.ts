import { Router } from "@vaadin/router";
import { state } from "../../state";

const logo = require("../../assets/logo.svg");

class HeaderCustomElement extends HTMLElement {
   connectedCallback() {
      state.subscribe(() => {
         this.render();
      });
      this.render();
   }

   render(): void {
      const currentUser = state.getState().user;
      let email, closeSession: string;

      if (currentUser.email) {
         email = currentUser.email;
         closeSession = "Cerrar sesión";
      } else {
         email = "";
         closeSession = "Iniciar sesión";
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
         </div>`;

      const menuToggleEl = this.querySelector(".hamburger-menu");
      const menuEl = this.querySelector(".home__menu");
      const logoEl = this.querySelector(".header-comp__logo");

      logoEl.addEventListener("click", () => {
         Router.go("/home");
      });

      menuToggleEl.addEventListener("click", () => {
         menuToggleEl.classList.toggle("active");
         menuEl.classList.toggle("active");
      });

      const textEl = this.querySelectorAll(".home__menu-text");
      textEl.forEach((element) => {
         element.addEventListener("click", (e) => {
            menuToggleEl.classList.toggle("active");
            menuEl.classList.toggle("active");
         });
      });

      const misDatosEl = this.querySelector(".mis-datos");
      misDatosEl.addEventListener("click", () => {
         const currentState = state.getState();

         if (currentState.user.token) {
            Router.go("/my-data");
         } else {
            Router.go("/verify-email");
         }
      });

      const reportarMascotaEl = this.querySelector(".reportar-mascota");
      reportarMascotaEl.addEventListener("click", () => {
         if (currentUser.token) {
            Router.go("/report-pet");
         } else {
            Router.go("/verify-email");
         }
      });

      const misMascotasEl = this.querySelector(".mis-mascotas");
      misMascotasEl.addEventListener("click", () => {
         if (currentUser.token) {
            Router.go("/my-pets");
         } else {
            Router.go("/verify-email");
         }
      });

      const singOffEl = this.querySelector(".home__menu-sign-off");
      singOffEl.addEventListener("click", () => {
         if (singOffEl.textContent === "Cerrar sesión") {
            state.setState({
               user: {},
            });
            state.clearLocalStorage();
            Router.go("/home");
         } else if (singOffEl.textContent === "Iniciar sesión") {
            menuToggleEl.classList.toggle("active");
            menuEl.classList.toggle("active");
            Router.go("/verify-email");
         }
      });
   }
}
customElements.define("header-comp", HeaderCustomElement);
