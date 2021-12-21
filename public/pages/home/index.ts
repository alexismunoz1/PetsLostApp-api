import { Router } from "@vaadin/router";
import { state } from "../../state";

class initHomePage extends HTMLElement {
   connectedCallback() {
      this.render();
      this.getCurrentUbication();
   }
   render(): void {
      this.innerHTML = `
      <h1>Home page</h1>
      <button-comp class="button-data">Mis datos</button-comp>
      <div class="cont__user-data"" style="display: none;">
         <p class="user-fullname"></p>
         <p class="user-email"></p>
      </div>
      <button-comp class="button-report">Reportar mascotas</button-comp>
      `;

      const contUserData: any = this.querySelector(".cont__user-data");
      const userFullname: any = this.querySelector(".user-fullname");
      const userEmail = this.querySelector(".user-email");
      const buttonData = this.querySelector(".button-data");
      const buttonReport = this.querySelector(".button-report");

      buttonReport.addEventListener("click", () => {
         const currentState = state.getState();

         if (currentState.user.token) {
            Router.go("/report-pet");
         } else {
            Router.go("/verify-email");
         }
      });

      buttonData.addEventListener("click", () => {
         const currentState = state.getState();
         const token = currentState.user.token;

         if (token) {
            state.geDatatUser(token).then((data) => {
               console.log(data);
               userFullname.textContent = `Fullname:${currentState.user.fullname}`;
               userEmail.textContent = `Email:${currentState.user.email}`;
               contUserData.style.display = "block";
            });
         } else {
            Router.go("/verify-email");
         }
      });
   }

   getCurrentUbication() {
      navigator.geolocation.getCurrentPosition((position) => {
         const lat = position.coords.latitude;
         const lng = position.coords.longitude;
         state.addCurrentUbication(lat, lng);
      });
   }
}
customElements.define("home-page", initHomePage);
