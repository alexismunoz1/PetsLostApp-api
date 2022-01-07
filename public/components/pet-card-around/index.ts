import { Router } from "@vaadin/router";
import { state } from "../../state";

class PetCardAroundCustomElement extends HTMLElement {
   shadow: ShadowRoot;
   connectedCallback() {
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
   }

   render(): void {
      let petId = this.getAttribute("petId");
      let petname = this.getAttribute("petname");

      this.shadow.innerHTML = `
         <div class="pet-card-around" petId="${petId}">
               <img class="pet-card-around__image" src="${this.getAttribute("image")}">
            <div class="pet-card-around__info-cont">
               <div class="pet-card-around__info">
                  <h2 class="pet-card-around__name">${petname}</h2>
                  <p class="pet-card-around__ubication">${this.getAttribute("ubication")}</p>
               </div>
               <p class="pet-card-around__report-info">Reportar información</p>
            </div>
         </div>`;

      const style = document.createElement("style");
      style.textContent = `
         .pet-card-around {
            max-width: 335px;
            flex-direction: column;
            border: 2px solid #000000;
            box-sizing: border-box;
            border-radius: 4px;
            margin: 30px;
         }

         .pet-card-around__image {
            width: 100%;
            height: auto;
         }

         .pet-card-around__info-cont {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0 15px 10px 15px;
         }
         
         .pet-card-around__info {
            font-family: Poppins;
         }

         .pet-card-around__name {
            margin: 0;
            font-weight: bold;
            font-size: 35px;
            color: #000000;
         }

         .pet-card-around__ubication {
            margin: 0;
            font-weight: 500;
            font-size: 16px;
            text-transform: uppercase;
            color: #000000;
         }

         .pet-card-around__state {
            font-family: Poppins;
            font-weight: 500;
            font-size: 16px;
            text-transform: uppercase;
         }

         .pet-card-around__report-info {
            width: 170px;
            font-family: Poppins;
            font-size: 16px;
            text-align: right;
            text-decoration-line: underline;
            text-transform: uppercase;
            cursor: pointer;
            color: #3E91DD;
         }`;

      const reportInfoEl = this.shadow.querySelector(".pet-card-around__report-info");
      reportInfoEl.addEventListener("click", () => {
         const currentState = state.getState();

         if (currentState.user.token) {
            state.setState({
               ...currentState,
               reportInfo: {
                  petId,
                  petname,
               },
            });

            Router.go("/report-info");
         } else {
            Router.go("/verify-email");
         }
      });

      this.shadow.appendChild(style);
   }
}

customElements.define("pet-card-around", PetCardAroundCustomElement);
