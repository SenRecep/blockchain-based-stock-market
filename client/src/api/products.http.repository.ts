import axios from "@/helpers/general.axios";
import { HttpRepositoryBase } from "./HttpRepositoryBase";

export interface Swap {
  fromMarketItemId: string;
  toMarketItemId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  amount: number;
}

export interface MarketItem {
  id: string;
  inProgress: string;
  createTime: string;
  product: Product;
}

export class ProductsHttpRepository extends HttpRepositoryBase {
  getOther(callback: ((data: any) => void) | undefined = undefined) {
    return this.send(axios.get("/market"), callback);
  }
  getUser(callback: ((data: any) => void) | undefined = undefined) {
    return this.send(axios.get("/market/user"), callback);
  }

  getProducts(callback: ((data: any) => void) | undefined = undefined) {
    return this.send(axios.get("/products/user"), callback);
  }
  createMarketItem(
    id: string,
    callback: ((data: any) => void) | undefined = undefined
  ) {
    return this.send(
      axios.post("/market", {
        product: id,
      }),
      callback
    );
  }

  createProduct(
    data: FormData,
    callback: ((data: any) => void) | undefined = undefined
  ) {
    return this.send(axios.postForm("/products", data), callback);
  }
  getMarketItem(
    id: string,
    callback: ((data: any) => void) | undefined = undefined
  ) {
    return this.send(axios.get(`/market/${id}`), callback);
  }

  swap(swap: Swap, callback: ((data: any) => void) | undefined = undefined) {
    return this.send(axios.post("/swaprequest", swap), callback);
  }
}

const instance = new ProductsHttpRepository();

export default instance;
