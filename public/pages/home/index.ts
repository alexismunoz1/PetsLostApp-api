import { Router } from "@vaadin/router";
import { state } from "../../state";

class initHomePage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      this.innerHTML = `
            <h1>Home page</h1>
        `;
   }
}
customElements.define("home-page", initHomePage);
