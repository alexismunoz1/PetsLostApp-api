import { Router } from "@vaadin/router";
import { state } from "../../state";

class initLoginPage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      this.innerHTML = `
            <h1>Iniciar sesión</h1>

            <form class="login__form">
               <input-comp class="login-password">Contraseña</input-comp>
               <button-comp class="login__button">Iniciar sesión</button-comp>
            </form>
        `;

      const formCont = this.querySelector(".login__form");
      formCont.addEventListener("submit", (event) => {
         event.preventDefault();

         const password = this.querySelector(".login-password")
            .shadowRoot.querySelector("input")
            .value.toString();

         state.getTokenUser(password).then((res) => {
            if (res.status === 200) {
               Router.go("/home");
            } else {
               alert("Error al iniciar sesión, verifique sus datos");
            }
         });
      });
   }
}
customElements.define("login-page", initLoginPage);
