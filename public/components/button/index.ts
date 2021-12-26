class buttonCustomElement extends HTMLElement {
   connectedCallback() {
      this.render();
   }

   render(): void {
      const style = document.createElement("style");
      const textButton = this.textContent;
      this.innerHTML = `
            <button class="button-comp">${textButton}</button>
        `;

      style.textContent = `
            .tipo-rosa {
               background: #FF9DF5;
            }
            
            .tipo-verde {
               background: #97EA9F;
            }
            
            .tipo-gris {
               background: #CDCDCD;
            }`;

      const backgroundColor = this.getAttribute("fondo");

      if (backgroundColor === "tipo-rosa") {
         this.querySelector(".button-comp").classList.add("tipo-rosa");
      } else if (backgroundColor === "tipo-verde") {
         this.querySelector(".button-comp").classList.add("tipo-verde");
      } else if (backgroundColor === "tipo-gris") {
         this.querySelector(".button-comp").classList.add("tipo-gris");
      }

      this.appendChild(style);
   }
}
customElements.define("button-comp", buttonCustomElement);
