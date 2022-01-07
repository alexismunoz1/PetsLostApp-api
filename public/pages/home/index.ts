import { state } from "../../state";

class InitHomePage extends HTMLElement {
   connectedCallback() {
      state.subscribe(() => {
         const currentUser = state.getState().user;
         if (currentUser.lat && currentUser.lng) {
            this.render();
         }
      });
      this.render();
   }
   render(): void {
      this.innerHTML = `
         <h1 class="home-page__title">Mascotas perdidas cerca tuyo</h1>`;

      this.classList.add("home-page");

      const currentUser = state.getState().user;
      if (!currentUser.lat && !currentUser.lng) {
         this.innerHTML += `
            <p class="home-page__text">Para ver las mascotas reportadas cerca tuyo 
            necesitamos permiso para conocer tu ubicación.</p>
            <button-comp class="button-ubication" fondo="tipo-rosa">Dar mi ubicación</button-comp>`;

         const buttonReport = this.querySelector(".button-ubication");
         buttonReport.addEventListener("click", () => {
            this.getCurrentUbication();
         });
      } else if (currentUser.lat && currentUser.lng) {
         state.getPetsAround(currentUser.lat, currentUser.lng).then((pets) => {
            if (pets.length > 0) {
               pets.forEach((pet) => {
                  this.innerHTML += `
                     <pet-card-around image="${pet.petimage}" petname="${pet.petname}" ubication="${pet.ubication}" petId="${pet.objectID}"></pet-card-around>`;
               });
            } else {
               this.innerHTML += `
                  <p class="home-page__text">No hay mascotas perdidas cerca tuyo</p>`;
            }
         });
      }
   }

   getCurrentUbication() {
      navigator.geolocation.getCurrentPosition((position) => {
         const lat = position.coords.latitude;
         const lng = position.coords.longitude;
         state.addCurrentUbication(lat, lng);
      });
   }
}
customElements.define("home-page", InitHomePage);
