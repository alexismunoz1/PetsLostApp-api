import { Router } from "@vaadin/router";
import { state } from "../../state";

class initHomePage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      this.innerHTML = `
         <h1 class="home-page__title">Mascotas perdidas cerca tuyo</h1>
         <p class="home-page__text">Para ver las mascotas reportadas cerca tuyo 
            necesitamos permiso para conocer tu ubicación.</p>
         <button-comp class="button-ubication" fondo="tipo-rosa">Dar mi ubicación</button-comp>`;
      this.classList.add("home-page");

      const buttonReport = this.querySelector(".button-ubication");
      buttonReport.addEventListener("click", () => {
         this.getCurrentUbication();
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
