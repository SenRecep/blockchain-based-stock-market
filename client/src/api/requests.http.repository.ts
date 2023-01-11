import axios from "@/helpers/general.axios";
import { HttpRepositoryBase } from "./HttpRepositoryBase";

export interface Product {
  name: string;
  description: string;
  amount: number;
  image: string;
}

export interface SwapRequest {
  id: string;
  verify: boolean;
  fromProduct: Product;
  toProduct: Product;
}
export class RequestsHttpRepository extends HttpRepositoryBase {
  getSwapRequests(callback: ((data: any) => void) | undefined = undefined) {
    return this.send(axios.get("/swaprequest"), callback);
  }

  verifyRequest(
    id: string,
    privateKey: string,
    callback: ((data: any) => void) | undefined = undefined
  ) {
    return this.send(
      axios.put("/swaprequest/getfromnotverified", {
        requestId: id,
        privateKey,
      }),
      callback
    );
  }
}

const instance = new RequestsHttpRepository();

export default instance;
