import { state } from "../../state";

class initMyDataPage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      const currenState = state.getState();

      let userName = "";
      let userEmail = "";

      if (currenState.user.fullname) userName = currenState.user.fullname;
      if (currenState.user.email) userEmail = currenState.user.email;

      this.innerHTML = `
            <header-comp></header-comp>
            <h1 class="mydata__title">Mis datos</h1>
            
            <input-comp class="mydata__input-name" label="nombre" value="${userName}"></input-comp>
            <input-comp class="mydata__input-email" label="email" value="${userEmail}"></input-comp>  
            <input-comp class="mydata__input-password" type="password" label="contraseña"></input-comp>
            <input-comp class="mydata__input-password-confirm" type="password" label="confirmar contraseña"></input-comp>
            
            <button-comp class="mydata__button-save" fondo="tipo-rosa">Guardar</button-comp>
            `;

      this.classList.add("mydata-page");

      const buttonSaveData = this.querySelector(".mydata__button-save");

      const inputNameEl = this.querySelector(".mydata__input-name");
      const inputEmailEl = this.querySelector(".mydata__input-email");
      const inputPasswordEl = this.querySelector(".mydata__input-password");
      const inputPasswordConfirmEl = this.querySelector(".mydata__input-password-confirm");

      buttonSaveData.addEventListener("click", () => {
         const fullname = inputNameEl.shadowRoot.querySelector("input").value;
         const email = inputEmailEl.shadowRoot.querySelector("input").value;
         const password = inputPasswordEl.shadowRoot.querySelector("input").value;
         const passwordConfirm = inputPasswordConfirmEl.shadowRoot.querySelector("input").value;

         const emailRegex =
            /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;

         if (fullname == "" || password == "" || passwordConfirm == "")
            return alert("Todos los campos son obligatorios");

         if (emailRegex.test(email) === false) return alert("Por favor ingrese un email válido");

         if (password !== passwordConfirm) return alert("Las contraseñas no coinciden");

         state.singup(fullname, email, password).then((res) => {
            if (res.status === 200) {
               state.getTokenUser(password);
               alert(`Bienvenidx ${fullname}!</br> sus datos fueron guardados correctamente`);
            } else {
               alert("Error al crear la cuenta");
            }
         });
      });
   }
}

customElements.define("my-data-page", initMyDataPage);
