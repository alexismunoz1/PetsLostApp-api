// const API_BASE_URL = "https://dwf-m7-postgresql.herokuapp.com";
const API_BASE_URL = "http://localhost:3000";

export const state = {
   data: {
      user: {},
   },

   initLocalStorage() {
      const data = localStorage.getItem("data");
      if (data) {
         this.data = JSON.parse(data);
      }
   },

   getState() {
      return this.data;
   },

   setState(newData): void {
      this.data = newData;
      localStorage.setItem("data", JSON.stringify(newData));
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

      this.setState({
         ...currentState,
         user: {
            ...currentState.user,
            email: email,
         },
      });

      return resVerifyEmail;
   },

   async singup(fullname: string, password: string): Promise<Response> {
      const currentState = this.getState();
      const currentEmail: string = currentState.user.email;

      const resSingupOrLogin = await fetch(`${API_BASE_URL}/auth`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            fullname,
            email: currentEmail,
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

      return resToken;
   },

   async geDatatUser(token: string): Promise<any> {
      const currentState = this.getState();

      const resDataUser = await fetch(`${API_BASE_URL}/me`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      });

      const user = await resDataUser.json();

      return resDataUser;
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

      return resReportPet;
   },
};
