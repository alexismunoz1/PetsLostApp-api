import { Router } from "@vaadin/router";
import { state } from "../../state";

class initHomePage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      this.innerHTML = `
      <h1>Home page</h1>
      <button-comp class="button-data">Mis datos</button-comp>
      <div class="cont__user-data"" style="display: none;">
         <p class="user-fullname"></p>
         <p class="user-email"></p>
      </div>
      `;

      const contUserData: any = this.querySelector(".cont__user-data");
      const userFullname: any = this.querySelector(".user-fullname");
      const userEmail = this.querySelector(".user-email");
      const buttonData = this.querySelector(".button-data");

      buttonData.addEventListener("click", () => {
         const currentState = state.getState();
         const token = currentState.user.token;

         state.geDatatUser(token).then((data) => {
            console.log(data);
            userFullname.textContent = `Fullname:${currentState.user.fullname}`;
            userEmail.textContent = `Email:${currentState.user.email}`;
            contUserData.style.display = "block";
         });
      });
   }
}
customElements.define("home-page", initHomePage);
