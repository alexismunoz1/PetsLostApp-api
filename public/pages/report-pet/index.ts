import { Router } from "@vaadin/router";
import { state } from "./../../state";
import * as mapboxgl from "mapbox-gl";
import { initMapMapbox, initSearchFormMapbox } from "../../lib/mapbox";
import { dropzoneUpload } from "../../lib/dropzone";
const defaultImg = require("../../assets/default-img.png");

class InitReportPage extends HTMLElement {
   connectedCallback() {
      this.render();
   }
   render(): void {
      this.innerHTML = `
         <h1 class="report__title">Reportar mascota perdida</h1>
        
         <input-comp class="report__input-petname" label="nombre de la mascota"></input-comp>

         <img class="report__dropzone-img" src="${defaultImg}" crossorigin="anonymous">
         <button-comp class="report__dropzone-button" fondo="tipo-verde">Agregar/modifiar imagen</button-comp>

         <div class="report__content-mapbox" style="width: 335px; height: 335px"></div>
         <input-comp class="report__input-mapbox" type="text" name="geoloc" label="Ciudad/Barrio/Localidad"></input-comp>
         <button-comp class="report__button-mapbox" fondo="tipo-verde">Buscar</button-comp>

         <p class="report__text">Buscá un punto de referencia para reportar a tu mascota. 
            Puede ser una dirección, un barrio o una ciudad.</p>

         <button-comp class="report__save-button" fondo="tipo-rosa">Reportar</button-comp>
         <button-comp class="report__cancel-button" fondo="tipo-gris">Cancelar</button-comp>`;

      this.classList.add("report-page");

      const petNameInput: HTMLInputElement = this.querySelector(".report__input-petname");

      const dropzoneImage: any = this.querySelector(".report__dropzone-img");
      const dropzoneButton = this.querySelector(".report__dropzone-button");

      const mapElement = this.querySelector(".report__content-mapbox");
      const mapboxInputEl = this.querySelector(".report__input-mapbox");
      const mapboxButtonEl = this.querySelector(".report__button-mapbox");

      const buttonReport = this.querySelector(".report__save-button");

      // Inicializar Dropzone para subir imagen
      let pictureImage;
      const dropzoneInit = dropzoneUpload(dropzoneImage, dropzoneButton);

      dropzoneInit.then((dropzone) => {
         dropzone.on("thumbnail", (file) => {
            dropzoneImage.src = file.dataURL;
            pictureImage = file.dataURL;

            // Si la imagen es muy grande, la reduzco
            if (file.width > 300) {
               dropzone.options.resizeWidth = 300;
            }
         });
         dropzone.processQueue();
      });

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

         const { lng, lat } = markerMap.getLngLat();
         state.currentMarkerPosition(lat, lng);

         // Inicializar el formulario de busqueda de direcciones

         mapboxButtonEl.addEventListener("click", () => {
            // Obtener la direccion ingresada por el usuario
            const mapboxInputValue = mapboxInputEl.shadowRoot.querySelector("input").value;

            if (mapboxInputValue === null || mapboxInputValue === "") {
               alert("Ingrese una dirección válida");
            } else {
               initSearchFormMapbox(mapboxInputValue, function (results) {
                  // Obtener las cordenadas del primer resultado de la busqueda
                  const firstResult = results[0];
                  const [lng, lat] = firstResult.geometry.coordinates;

                  markerMap.setLngLat([lng, lat]).addTo(map);
                  map.setCenter([lng, lat]);
                  map.setZoom(14);
                  state.currentMarkerPosition(lat, lng);
               });
            }
         });

         // Evento de arrastre del marker para actualizar la ubicación
         markerMap.on("dragend", () => {
            const { lng, lat } = markerMap.getLngLat();
            // Se guarda la ubicación actual del marker en el state
            state.currentMarkerPosition(lat, lng);
         });
      });

      // Evento de click en el boton de reportar mascota perdida
      buttonReport.addEventListener("click", (e) => {
         const user = state.getState().user;
         let petname = petNameInput.shadowRoot.querySelector("input").value;
         let lat = user.currentMarkerLat;
         let lng = user.currentMarkerLng;
         const mapboxInputValue = mapboxInputEl.shadowRoot.querySelector("input").value;

         if (!petname || petname === "") {
            alert("Ingrese un nombre para la mascota");
         } else if (!mapboxInputValue || mapboxInputValue === "") {
            alert("Ingrese una Ciudad/Barrio/Localidad");
         } else if (!pictureImage) {
            alert("Seleccione una ubicación para la mascota");
         } else if (!lat || !lng) {
            alert("Seleccione una imagen para la mascota");
         } else {
            state.addPet(petname, lat, lng, mapboxInputValue, pictureImage);
            alert("Mascota reportada");
            Router.go("/home");
         }
      });

      // Evento de cancelar el reporte
      const cancelButton = this.querySelector(".report__cancel-button");
      cancelButton.addEventListener("click", () => {
         Router.go("/home");
         state.setState({
            user: {
               ...state.getState().user,
               currentMarkerLat: "",
               currentMarkerLng: "",
            },
         });
      });
   }
}

customElements.define("report-pet-page", InitReportPage);
