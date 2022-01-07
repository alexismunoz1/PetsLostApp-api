import { Router } from "@vaadin/router";
import { state } from "../../state";

class InitReportInfo extends HTMLElement {
   connectedCallback() {
      this.render();
   }

   render(): void {
      const curretReportInfoData = state.getState().reportInfo;
      let petId = curretReportInfoData.petId;
      let petname = curretReportInfoData.petname;

      this.innerHTML = `
            <h1 class="report-info__title">Reportar info de ${petname}</h1>

            <input-comp class="report-info__input-name" label="tu nombre"></input-comp>
            <input-comp class="report-info__input-phone" label="tu telefono"></input-comp>

            <textarea-comp class="report-info__textarea" label="donde lo viste?"></textarea-comp>
            
            <button-comp class="report-info__btn-send" fondo="tipo-rosa">Enviar</button-comp>
            <button-comp class="report-info__btn-cancel" fondo="tipo-gris">Cancelar</button-comp>`;

      this.classList.add("report-info__page");

      const inputNameEl = this.querySelector(".report-info__input-name");
      const inputPhoneEl = this.querySelector(".report-info__input-phone");
      const textareaEl = this.querySelector(".report-info__textarea");

      const buttonSendEl = this.querySelector(".report-info__btn-send");

      buttonSendEl.addEventListener("click", () => {
         const fullname = inputNameEl.shadowRoot.querySelector("input").value;
         const phonenumber = inputPhoneEl.shadowRoot.querySelector("input").value;
         const report = textareaEl.shadowRoot.querySelector("textarea").value;

         if (!fullname || fullname == "" || fullname == null) {
            alert("Por favor ingrese su nombre");
         } else if (!phonenumber || phonenumber == "" || phonenumber == null) {
            alert("Por favor ingrese un numero de telefono");
         } else if (!report || report == "" || report == null) {
            alert("Por ingrese informacion sobre la mascota");
         } else {
            state.reportInfo(petId, fullname, phonenumber, report);
            alert("Reporte enviado");
            Router.go("/home");
         }
      });

      const cancelButtonEl = this.querySelector(".report-info__btn-cancel");
      cancelButtonEl.addEventListener("click", () => {
         const result = window.confirm("Desea cancelar el reporte?");
         if (result == true) {
            Router.go("/home");
         }
      });
   }
}
customElements.define("report-info-page", InitReportInfo);
