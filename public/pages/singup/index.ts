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
               <input-comp class="singup-email">Email</input-comp>
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

         const email = this.querySelector(".singup-email")
            .shadowRoot.querySelector("input")
            .value.toString();

         const password = this.querySelector(".singup-password")
            .shadowRoot.querySelector("input")
            .value.toString();

         const confirmPassword = this.querySelector(".singup-confirm-password")
            .shadowRoot.querySelector("input")
            .value.toString();

         if (fullname === "" || email === "" || password === "") {
            alert("Todos los campos son obligatorios");
         } else if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
         } else {
            state.singupOrLogin(fullname, email, password).then((res) => {
               if (res.status === 200) {
                  state.getTokenUser(email, password).then((res) => console.log(res));
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
