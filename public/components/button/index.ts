class buttonCustomElemente extends HTMLElement {
   connectedCallback() {
      this.render();
   }

   render(): void {
      const textButton = this.textContent;
      this.innerHTML = `
            <button>${textButton}</button>
        `;
   }
}
customElements.define("button-comp", buttonCustomElemente);
