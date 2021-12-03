import { Router } from "@vaadin/router";
import { state } from "../../state";

class initSingupPage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      this.innerHTML = `
            <h1>Crear cuenta</h1>

            <form class="singup__form">
               <input-comp class="singup-fullname">Nombre</input-comp>
               <input-comp class="singup-password">Contraseña</input-comp>
               <input-comp class="singup-confirm-password">Repetir contraseña</input-comp>
               <button-comp class="singup__button">Crear cuenta</button-comp>
            </form>

        `;

      const formCont: any = this.querySelector(".singup__form");
      formCont.addEventListener("submit", (event) => {
         event.preventDefault();

         const fullname = this.querySelector(".singup-fullname")
            .shadowRoot.querySelector("input")
            .value.toString();

         const password = this.querySelector(".singup-password")
            .shadowRoot.querySelector("input")
            .value.toString();

         const confirmPassword = this.querySelector(".singup-confirm-password")
            .shadowRoot.querySelector("input")
            .value.toString();

         if (fullname === "" || password === "" || confirmPassword === "") {
            alert("Todos los campos son obligatorios");
         }

         if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
         }

         if (password === confirmPassword) {
            state.singup(fullname, password).then((res) => {
               if (res.status === 200) {
                  state.getTokenUser(password);
                  alert("Cuenta creada con éxito");
                  Router.go("/home");
               } else {
                  alert("Error al crear la cuenta");
               }
            });
         }
      });
   }
}
customElements.define("singup-page", initSingupPage);
