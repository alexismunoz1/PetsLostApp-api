const API_BASE_URL = "https://dwf-m7-postgresql.herokuapp.com";

export const state = {
   data: {},

   getData() {
      return this.data;
   },

   setData(data) {
      this.data = data;
   },

   async createAccount(fullname: string, email: string, password: string): Promise<Response> {
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

   async loginMethod(email: string, password: string): Promise<Response> {
      return fetch(`${API_BASE_URL}/auth/token`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            email,
            password,
         }),
      });
   },
};
