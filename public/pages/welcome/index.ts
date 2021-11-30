import { Router } from "@vaadin/router";
import { state } from "../../state";

class initHomePage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      this.innerHTML = `
            <h1>Soy la home-page</h1>
            <button-comp class="login__button">Iniciar seción</button-comp>
            <button-comp class="singup__button">Crear cuenta</button-comp>
        `;

      const loginButton = this.querySelector(".login__button");
      loginButton.addEventListener("click", () => {
         Router.go("/login");
      });

      const singupButton = this.querySelector(".singup__button");
      singupButton.addEventListener("click", () => {
         Router.go("/singup");
      });
   }
}
customElements.define("welcome-page", initHomePage);
