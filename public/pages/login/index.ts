import { Router } from "@vaadin/router";
import { state } from "../../state";

class initLoginPage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      this.innerHTML = `
         <h1 class="login__title">Ingresar</h1>
         <input-comp class="login__input-password" type="password" label="contraseña">Contraseña</input-comp>
         <button-comp class="login__button-login" fondo="tipo-rosa">Ingresar</button-comp>`;

      this.classList.add("login-page");

      const inputPasswordEl = this.querySelector(".login__input-password");
      const buttonLoginEl = this.querySelector(".login__button-login");

      const currenState = state.getState();
      const userName = currenState.user.fullname;

      buttonLoginEl.addEventListener("click", () => {
         const password = inputPasswordEl.shadowRoot.querySelector("input").value;

         state.getTokenUser(password).then((res) => {
            if (res.status === 200) {
               Router.go("/my-data");
            } else {
               alert(`${userName}, la contraseña es incorrecta`);
            }
         });
      });
   }
}
customElements.define("login-page", initLoginPage);
