import axios from "@/helpers/general.axios";
import { HttpRepositoryBase } from "./HttpRepositoryBase";

interface EmailModel {
  email: string;
}

interface VerificationModel extends EmailModel {
  code: string;
}

interface PasswordModel extends VerificationModel {
  password: string;
}

export class ForgotPasswordHttpRepository extends HttpRepositoryBase {
  sendEmail(model: EmailModel, callback: (data: any) => void) {
    return this.send(axios.post("/forgotpassword/email", model), callback);
  }
  sendCode(model: VerificationModel, callback: (data: any) => void) {
    return this.send(axios.post("/forgotpassword/code", model), callback);
  }
  sendPassword(model: PasswordModel, callback: (data: any) => void) {
    return this.send(axios.put("/forgotpassword/password", model), callback);
  }
}

const instance = new ForgotPasswordHttpRepository();

export default instance;
