import { Router } from "@vaadin/router";
import { state } from "../../state";

class initHomePage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      const currentState = state.getState();

      this.innerHTML = `
            <h1>Welcome</h1>
            <form class="welcome-form">
               <input-comp class="input-email">Email</input-comp>
               <button-comp class="button-next">Siguiente</button-comp>
            </form>
        `;

      const welcomeForm = this.querySelector(".welcome-form");
      welcomeForm.addEventListener("submit", (e) => {
         e.preventDefault();
         const email = this.querySelector(".input-email")
            .shadowRoot.querySelector("input")
            .value.toString();

         state.verifyEmail(email).then((res) => {
            if (res.status === 200) {
               Router.go("/login");
            } else if (res.status === 404) {
               Router.go("/singup");
            }
         });
      });
   }
}
customElements.define("welcome-page", initHomePage);
