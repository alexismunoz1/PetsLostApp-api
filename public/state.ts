const API_BASE_URL = "https://dwf-m7-postgresql.herokuapp.com";

export const state = {
   data: {
      user: {},
      editPet: {},
      reportInfo: {},
   },

   listeners: [],

   initLocalStorage() {
      // Metodo para inicializar el localStorage
      const dataUser = JSON.parse(localStorage.getItem("dataUser"));
      const currentState = state.getState();

      if (!dataUser || dataUser == null || dataUser == undefined) {
         return;
      } else {
         this.setState({
            ...currentState,
            user: {
               ...currentState.user,
               fullname: dataUser.fullname,
               email: dataUser.email,
               token: dataUser.token,
            },
         });
      }
   },

   getState() {
      // Metodo para obtener el estado actual
      return this.data;
   },

   setState(newData): void {
      // Metodo para actualizar el estado
      this.data = newData;
      this.setUserDataLocalStorage();
      for (const cb of this.listeners) {
         cb();
      }
      console.log("State updated", this.data);
   },

   subscribe(callback: (any) => any): void {
      // Metodo para subscribirse a los cambios del estado
      this.listeners.push(callback);
   },

   setUserDataLocalStorage(): void {
      // Metodo para guardar los datos del usuario en el localStorage
      const dataUser = this.getState().user;
      localStorage.setItem("dataUser", JSON.stringify(dataUser));
   },

   clearLocalStorage(): void {
      // Metodo para limpiar el localStorage
      localStorage.removeItem("dataUser");
   },

   addCurrentUbication(lat, lng): void {
      // Metodo para agregar la ubicacion actual
      const currentState = this.getState();
      currentState.user.lat = lat;
      currentState.user.lng = lng;
      this.setState(currentState);
   },

   currentMarkerPosition(lat, lng): void {
      // Metodo para obtener la posicion actual del marcador de MapBox
      const currentState = this.getState();
      state.setState({
         ...currentState,
         user: {
            ...currentState.user,
            currentMarkerLat: lat,
            currentMarkerLng: lng,
         },
      });
   },

   async verifyEmail(email: string): Promise<Response> {
      // Metodo para verificar el correo electronico
      const currentState = this.getState();
      const resVerifyEmail = await fetch(`${API_BASE_URL}/auth/verify-email`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            email,
         }),
      });

      const resVerifyEmailData = await resVerifyEmail.json();

      this.setState({
         ...currentState,
         user: {
            ...currentState.user,
            email: email,
            fullname: resVerifyEmailData.fullname,
         },
      });

      return resVerifyEmail;
   },

   async singup(fullname: string, email: string, password: string): Promise<Response> {
      // Metodo para registrar un usuario
      const currentState = this.getState();
      const currentEmail: string = currentState.user.email;

      const resSingupOrLogin = await fetch(`${API_BASE_URL}/auth`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            fullname,
            email,
            password,
         }),
      });

      this.setState({
         ...currentState,
         user: {
            ...currentState.user,
            fullname: fullname,
         },
      });

      return resSingupOrLogin;
   },

   async getTokenUser(password: string): Promise<Response> {
      // Metodo para obtener el token del usuario
      const currentState = this.getState();

      const resToken = await fetch(`${API_BASE_URL}/auth/token`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            email: currentState.user.email,
            password,
         }),
      });

      const token = await resToken.json();

      this.setState({
         ...currentState,
         user: {
            ...currentState.user,
            token: token,
         },
      });

      return resToken;
   },

   async geUserDatatBytoken(token: string): Promise<Response> {
      // Metodo para obtener los datos del usuario
      const currentState = this.getState();

      const resDataUser = await fetch(`${API_BASE_URL}/me`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      });

      const dataUser = await resDataUser.json();

      return this.setState({
         ...currentState,
         user: {
            ...currentState.user,
            fullname: dataUser.fullname,
            email: dataUser.email,
            token: token,
         },
      });
   },

   async addPet(petname: string, lat, lng, ubication, petimage): Promise<Response> {
      // Metodo para agregar una mascota
      const currentState = this.getState();
      const token = currentState.user.token;

      const resReportPet = await fetch(`${API_BASE_URL}/me/pets`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            petname,
            lat,
            lng,
            ubication,
            petimage,
         }),
      });

      return resReportPet.json();
   },

   async editPet(petid, petname: string, lat, lng, ubication: string, petimage): Promise<Response> {
      // Metodo para editar los datos de una mascota
      const currentState = this.getState();
      const token = currentState.user.token;

      const resReportPet = await fetch(`${API_BASE_URL}/me/pets`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            petid,
            petname,
            lat,
            lng,
            ubication,
            petimage,
         }),
      });

      return resReportPet.json();
   },

   async updateStatePet(petid, petstate) {
      // Metodo para actualizar el estado (ya sea perdido o encontrado) de una mascota
      const currentState = this.getState();
      const token = currentState.user.token;

      const statePet = await fetch(`${API_BASE_URL}/me/pets/state`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            petid,
            petstate,
         }),
      });
   },

   async getPetById(petId: string) {
      // Metodo para obtener una mascota por su id
      const currentState = this.getState();
      const token = currentState.user.token;

      const petById = await fetch(`${API_BASE_URL}/me/pets/${petId}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      });

      return petById.json();
   },

   async getUserPets(): Promise<any> {
      // Metodo para obtener las mascotas de un usuario
      const currentState = this.getState();
      const token = currentState.user.token;

      const pets = await fetch(`${API_BASE_URL}/me/pets`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      });

      return pets.json();
   },

   async deletePet(petid) {
      // Metodo para eliminar una mascota
      const currentState = this.getState();
      const token = currentState.user.token;

      const deletePet = await fetch(`${API_BASE_URL}/me/pets`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            petid,
         }),
      });
   },

   async getPetsAround(lat, lng) {
      // Metodo para obtener las mascotas cercanas a una ubicacion
      const currentState = this.getState();
      const token = currentState.user.token;

      const petsAround = await fetch(`${API_BASE_URL}/pets/around?lat=${lat}&lng=${lng}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      });

      return petsAround.json();
   },

   async reportInfo(petid, fullname, phonenumber, report) {
      // Metodo para reportar una mascota
      const currentState = this.getState();
      const token = currentState.user.token;

      const reportInfo = await fetch(`${API_BASE_URL}/pets/report`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            petid,
            fullname,
            phonenumber,
            report,
         }),
      });

      return reportInfo.json();
   },
};
