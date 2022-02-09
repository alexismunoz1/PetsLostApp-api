import { Router } from "@vaadin/router";
import { state } from "../../state";
const iconEdit = require("../../assets/icon-edit.svg");

class PetCardCustomElement extends HTMLElement {
   shadow: ShadowRoot;
   connectedCallback() {
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
   }

   render(): void {
      let petId = this.getAttribute("petId");
      this.shadow.innerHTML = `
            <div class="pet-card" petId="${petId}">
                  <img class="pet-card__image" src="${this.getAttribute("image")}">
               <div class="pet-card__info-cont">
                  <div class="pet-card__info">
                     <h2 class="pet-card__name">${this.getAttribute("name")}</h2>
                     <p class="pet-card__ubication">${this.getAttribute("ubication")}</p>
                     <p class="pet-card__state">${this.getAttribute("state")}</p>
                  </div>
                  <img class="pet-card__icon" src="${iconEdit}">
               </div>
            </div>`;

      const style = document.createElement("style");
      style.textContent = `
         .pet-card {
            display: flex;
            flex-direction: column;
            width: 335px;
            border: 2px solid #000000;
            box-sizing: border-box;
            border-radius: 4px;
            margin-bottom: 30px;
         }

         .pet-card__image {
            width: 100%;
            height: auto;
         }

         .pet-card__info-cont {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0 15px 10px 15px;
         }
         
         .pet-card__info {
            font-family: Poppins;
         }

         .pet-card__name {
            margin: 0;
            font-weight: bold;
            font-size: 35px;
            color: #000000;
         }

         .pet-card__ubication {
            margin: 0;
            font-weight: 500;
            font-size: 16px;
            text-transform: uppercase;
            color: #000000;
         }

         .pet-card__state {
            font-family: Poppins;
            font-weight: 500;
            font-size: 16px;
            text-transform: uppercase;
         }

         .pet-card__icon {
            cursor: pointer;
            height: 30px;
            width: auto;
            margin: auto 0;
         }`;

      if (this.getAttribute("state") === "Perdido") {
         style.textContent += `
            .pet-card__state {
               color: #FF3A3A;
            }`;
      } else if (this.getAttribute("state") === "Encontrado") {
         style.textContent += `
            .pet-card__state {
               color: #49a223;
            }`;
      }

      this.shadow.appendChild(style);

      const editPetEl = this.shadow.querySelector(".pet-card__icon");
      editPetEl.addEventListener("click", () => {
         const currentState = state.getState();
         state.setState({
            ...currentState,
            user: {
               ...currentState.user,
               currentPetId: petId,
            },
         });
         Router.go("/edit-pet");
      });
   }
}

customElements.define("pet-card", PetCardCustomElement);
