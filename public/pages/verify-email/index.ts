import { Router } from "@vaadin/router";
import { state } from "../../state";

class initHomePage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      this.innerHTML = `
            <h1 class="verify__title">Ingresar</h1>
            <input-comp class="verify__input-email" label="email">Email</input-comp>
            <button-comp class="verify__button-next" fondo="tipo-rosa">Siguiente</button-comp>`;

      this.classList.add("verify-page");

      const buttonNextEl = this.querySelector(".verify__button-next");
      const inputEmailEl = this.querySelector(".verify__input-email");

      buttonNextEl.addEventListener("click", () => {
         const email = inputEmailEl.shadowRoot.querySelector("input").value;

         const emailRegex =
            /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;

         if (emailRegex.test(email) === false) {
            return alert("Por favor ingrese un email válido");
         }

         state.verifyEmail(email).then((res) => {
            if (res.status === 200) {
               Router.go("/login");
            } else if (res.status === 404) {
               const result = window.confirm("El email no existe, desea crear una cuenta?");
               if (result === true) Router.go("/my-data");
            }
         });
      });
   }
}
customElements.define("verify-email-page", initHomePage);
