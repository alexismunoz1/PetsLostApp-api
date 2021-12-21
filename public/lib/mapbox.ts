import * as MapboxClient from "mapbox";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

export async function initMapbox(formElement, mapElement, lat, lng) {
   function initMap() {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      console.log("mapElement !!", mapElement);
      return new mapboxgl.Map({
         container: mapElement,
         style: "mapbox://styles/mapbox/streets-v11",
         center: [lng, lat],
         zoom: 20,
      });
   }

   function initSearchForm(callback) {
      formElement.addEventListener("submit", (event) => {
         event.preventDefault();
         mapboxClient.geocodeForward(
            event.target.geoloc.value,
            {
               country: "ar",
               autocomplete: true,
               language: "es",
            },
            function (err, data, res) {
               if (!err) callback(data.features);
            }
         );
      });
   }

   (function () {
      // formElement.map = initMap();
      const map = initMap();
      initSearchForm(function (results) {
         const firstResult = results[0];
         const marker = new mapboxgl.Marker()
            .setLngLat(firstResult.geometry.coordinates)
            .addTo(mapElement);
         // const [lat, lng] = firstResult.geometry.coordinates;

         map.setCenter(firstResult.geometry.coordinates);
         map.setZoom(14);
      });
   })();
}
