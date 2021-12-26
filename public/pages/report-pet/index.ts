import { Router } from "@vaadin/router";
import { state } from "./../../state";
import * as mapboxgl from "mapbox-gl";
import { initMapMapbox, initSearchFormMapbox } from "../../lib/mapbox";
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
               <input class="input-petname" type="text" name="name" placeholder="Nombre de la mascota" required>
               <input type="text" name="geoloc" placeholder="Ingresa tu ubicación" />
               <div class="content-mapbox" style="width: 335px; height: 335px"></div>
               <img class="dropzone-img" src="${defaultImg}" crossorigin="anonymous">
               <button-comp class="dropzone-button">Agregar/modifiar imagen</button-comp>
            <button-comp class="report-button">Reportar</button-comp>
        </form>
        `;

      const formReport: HTMLFormElement = this.querySelector(".report-form");
      const petNameInput: HTMLInputElement = this.querySelector(".input-petname");
      const dropzoneImgBtn: Element = this.querySelector(".dropzone-img");
      const dropzoneButton: Element = this.querySelector(".dropzone-button");
      const buttonReport: Element = this.querySelector(".report-button");
      const mapElement = this.querySelector(".content-mapbox");

      const currentState = state.getState();

      // Ubicacion por defecto del centro geografico de Argentina
      let defaultLat = -34.8403116;
      let defaultLng = -64.5965932;
      let currentLat, currentLng;

      if (!currentState.user.lat && !currentState.user.lng) {
         // Si no hay una ubicación guardada en el state,
         // se usa la ubicación por defecto
         currentLat = defaultLat;
         currentLng = defaultLng;
      } else if (currentState.user.lat && currentState.user.lng) {
         currentLng = currentState.user.lng;
         currentLat = currentState.user.lat;
      }

      // Inicializar mapa con Mapbox
      initMapMapbox(mapElement, currentLat, currentLng).then((map) => {
         // Inicializar marker con opciones de arrastre "drag"
         const markerMap = new mapboxgl.Marker({ draggable: true });

         // inicializar el marker en la ubicación actual del usuario
         markerMap.setLngLat([currentLng, currentLat]).addTo(map);

         // Inicializar el formulario de busqueda de direcciones
         initSearchFormMapbox(formReport, function (results) {
            // Obtener las cordenadas del primer resultado de la busqueda
            const firstResult = results[0];
            const [lng, lat] = firstResult.geometry.coordinates;

            markerMap.setLngLat([lng, lat]).addTo(map);
            map.setCenter([lng, lat]);
            map.setZoom(14);
         });

         // Evento de arrastre del marker para actualizar la ubicación
         markerMap.on("dragend", () => {
            const { lng, lat } = markerMap.getLngLat();
            // Se guarda la ubicación actual del marker en el state
            state.currentMarkerPosition(lat, lng);
         });
      });

      // Inicializar Dropzone para subir imagen
      let pictureImage;
      const dropPrueba = dropzoneUpload(dropzoneImgBtn);

      dropPrueba.then((dropzone) => {
         dropzone.on("addedfile", (file) => {
            pictureImage = file.dataURL;
         });
      });

      buttonReport.addEventListener("click", (e) => {
         e.preventDefault();
         let lat = currentState.user.currentMarkerLat;
         let lng = currentState.user.currentMarkerLng;
         let petname = petNameInput.value;

         state.addPet(petname, lat, lng, pictureImage).then((res) => {
            console.log(res);
         });
      });
   }
}

customElements.define("report-pet-page", initReportPage);
