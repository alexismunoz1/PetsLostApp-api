import { state } from "../../state";
import { Router } from "@vaadin/router";

class InitMyPetsPage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      const currentUser = state.getState().user;
      this.innerHTML = `
         <h1 class="mypets__title">Mis mascotas  reportadas</h1>`;

      if (currentUser.token) {
         state.getUserPets().then((pets) => {
            if (pets.length > 0) {
               pets.forEach((pet) => {
                  this.innerHTML += `
                  <pet-card image="${pet.petimage}" name="${pet.petname}" ubication="${pet.ubication}" petId="${pet.id}"></pet-card>`;
               });
               console.log(pets);
            } else {
               this.innerHTML += `
                  <p class="mypets__text">Aun no reportaste mascotas perdidas</p>`;
            }
         });
      }

      this.classList.add("mypets-page");
   }
}

customElements.define("my-pets-page", InitMyPetsPage);
