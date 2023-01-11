import axios from "@/helpers/general.axios";
import { HttpRepositoryBase } from "./HttpRepositoryBase";

export class RequestsHttpRepository extends HttpRepositoryBase {
  getOther(callback: ((data: any) => void) | undefined = undefined) {
    return this.send(axios.get("/swaprequests/gettonotverified"), callback);
  }
}

const instance = new RequestsHttpRepository();

export default instance;
