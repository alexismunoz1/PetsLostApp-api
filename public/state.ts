// const API_BASE_URL = "https://dwf-m7-postgresql.herokuapp.com" || "http://localhost:3000";
const API_BASE_URL = "http://localhost:3000";

export const state = {
   data: {
      user: {},
   },

   initLocalStorage() {
      const token = localStorage.getItem("token");
      if (token) {
         this.geUserDatatBytoken(token);
      }
   },

   getState() {
      return this.data;
   },

   setState(newData): void {
      this.data = newData;
      console.log("State updated", this.data);
   },

   addCurrentUbication(lat, lng): void {
      const currentState = this.getState();
      currentState.user.lat = lat;
      currentState.user.lng = lng;
      this.setState(currentState);
   },

   async verifyEmail(email: string): Promise<Response> {
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

   async getTokenUser(password: string): Promise<any> {
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

      localStorage.setItem("token", token);

      return resToken;
   },

   async geUserDatatBytoken(token: string): Promise<any> {
      const currentState = this.getState();

      const resDataUser = await fetch(`${API_BASE_URL}/me`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      });

      const dataUser = await resDataUser.json();

      this.setState({
         ...currentState,
         user: {
            ...currentState.user,
            fullname: dataUser.fullname,
            email: dataUser.email,
            token: token,
         },
      });
   },

   async currentMarkerPosition(lat, lng): Promise<any> {
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

   async addPet(petname: string, lat, lng, petimage): Promise<any> {
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
            petimage,
         }),
      });

      return resReportPet.json();
   },
};
