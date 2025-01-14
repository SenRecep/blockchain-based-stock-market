import axios from "@/helpers/general.axios";
import { HttpRepositoryBase } from "./HttpRepositoryBase";
interface SignInModel {
  email: string;
  password: string;
}

interface SignUpModel {
  email: string;
  password: string;
  name: string;
  surname: string;
  identityNumber: string;
  publicKey: string;
}

export class AuthHttpRepository extends HttpRepositoryBase {
  signIn(model: SignInModel, callback: (data: any) => void) {
    return this.send(axios.post("/auth", model), callback);
  }
  signUp(model: SignUpModel, callback: (data: any) => void) {
    return this.send(axios.post("/users", model), callback);
  }
}

const instance = new AuthHttpRepository();

export default instance;
