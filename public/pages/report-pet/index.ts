import { state } from "./../../state";
import { Router } from "@vaadin/router";
import { initMapbox } from "../../lib/mapbox";
import { dropzoneUpload } from "../../lib/dropzone";
const defaultImg = require("../../assets/default-img.png");

class initReportPage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      this.innerHTML = `
        <h1>Reportar mascotas</h1>
        <form class="report-form">
               <input type="text" name="geoloc" placeholder="Ingresa tu ubicación" />
               <div id="map" style="width: 335px; height: 335px"></div>
               <img class="dropzone-img" src="${defaultImg}" crossorigin="anonymous">
               <button-comp class="dropzone-button">Agregar/modifiar imagen</button-comp>
            <button-comp class="report-button">Reportar</button-comp>
        </form>
      `;

      const formReport: HTMLFormElement = this.querySelector(".report-form");
      const dropzoneImgBtn: Element = this.querySelector(".dropzone-img");
      const dropzoneButton: Element = this.querySelector(".dropzone-button");
      const buttonReport: Element = this.querySelector(".report-button");
      const mapElement = this.querySelector("#map");

      const currentState = state.getState();

      const currentLat = currentState.user.lat;
      const currentLng = currentState.user.lng;

      initMapbox(formReport, mapElement, currentLat, currentLng);

      let pictureImage;
      const dropPrueba = dropzoneUpload(dropzoneImgBtn);
      dropPrueba.then((dropzone) => {
         dropzone.on("addedfile", (file) => {
            pictureImage = file;
         });
      });

      let petname = "boby";

      formReport.addEventListener("submit", (e) => {
         e.preventDefault();
         console.log("formReport !", formReport.geoloc.value);
         // state.addPet(petname, lat, lng, pictureImage.dataURL).then((res) => {
         //    console.log(res);
         // });
      });
   }
}

customElements.define("report-pet-page", initReportPage);
