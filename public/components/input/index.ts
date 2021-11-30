class inputCustomElemente extends HTMLElement {
   shadow: ShadowRoot;
   connectedCallback() {
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
   }

   render(): void {
      const input = document.createElement("input");
      input.className = "input-comp";
      input.placeholder = this.textContent;

      this.shadow.appendChild(input);
   }
}
customElements.define("input-comp", inputCustomElemente);
