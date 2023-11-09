import request from "../utils/request";
import { setAuth } from "../utils/request";
const API_URL = "auth/signin";

class AuthService {
   async login(user) {
    console.log("user:", user);
    const postData = {
      username: user.user.sdt,
      password:  user.user.password
    }
    return await request
      .post(API_URL, postData)
      .then((response) => {
        const data = response.data
        localStorage.setItem("user", JSON.stringify(response.data));
        setAuth()
        return response.data
      })
      .catch((e) => {
        console.log(e);
        throw new Error(e);
        
      });
  }

  logout() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();
