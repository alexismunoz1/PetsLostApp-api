class inputCustomElemente extends HTMLElement {
   shadow: ShadowRoot;
   connectedCallback() {
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
   }

   render(): void {
      let customLabel = this.getAttribute("label");
      if (customLabel === null) customLabel = "";

      let customType = this.getAttribute("type");
      if (customType === null) customType = "text";

      let customPlaceholder = this.getAttribute("placeholder");
      if (customPlaceholder === null) customPlaceholder = "";

      let customValue = this.getAttribute("value");
      if (customValue === null) customValue = "";

      this.shadow.innerHTML = `
         <p class="input__label">${customLabel}</p>
         <input class="input-comp" type="${customType}" value="${customValue}" placeholder="${customPlaceholder}">`;

      const style = document.createElement("style");
      style.textContent = `
         .input-comp {
            padding: 0 10px;
            height: 50px;
            font-family: Poppins;
            font-weight: 500;
            font-size: 16px;
            color: #000000;
            border-radius: 4px;
            border: 2px solid #000000;
            background: #ffffff;
         }
         
         .input__label {
            margin: 0;
            font-family: Poppins;
            font-weight: 500;
            font-size: 16px;
            color: #000000;
            text-transform: uppercase;
         }`;

      this.shadow.appendChild(style);
   }
}
customElements.define("input-comp", inputCustomElemente);
