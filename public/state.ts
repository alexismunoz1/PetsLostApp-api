const API_BASE_URL = "https://dwf-m7-postgresql.herokuapp.com";

export const state = {
   data: {
      user: {
         token: null,
      },
   },

   getState() {
      return this.data;
   },

   setState(newData) {
      this.data = newData;
      console.log("State updated", this.data);
   },

   singupOrLogin(fullname: string, email: string, password: string): Promise<Response> {
      return fetch(`${API_BASE_URL}/auth`, {
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
   },

   async getTokenUser(email: string, password: string): Promise<any> {
      const currentState = this.getState();

      const resToken = await fetch(`${API_BASE_URL}/auth/token`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            email,
            password,
         }),
      });

      const token = await resToken.json();

      if (token.token) {
         currentState.user.token = token.token;
         this.setState(currentState);
      } else {
         currentState.user.token = null;
      }

      return resToken;
   },
};
