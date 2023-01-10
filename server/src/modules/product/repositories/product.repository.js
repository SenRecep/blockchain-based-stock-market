import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import ProductsSchema from "../../../models/Products.schema.js";
import UserRepository from "../../auth/repositories/user.repository.js";

class ProductRepository {
  async createProduct(product, id) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const addProduct = await ProductsSchema.create({
      ...product,
      verify: false,
      wallet: found.wallet,
    });
    return addProduct;
  }
  async getById(id) {
    return await ProductsSchema.findById(id);
  }
  async getUserProducts(id) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "userrepository->getuserproduct"
      );
    return await ProductsSchema.find({ wallet: found.wallet, verify: true });
  }
  async getUserPendingProducts(id) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "userrepository->getuserpendingproduct"
      );
    return await ProductsSchema.find({ wallet: found.wallet, verify: false });
  }
  async deleteById(id) {
    return await ProductsSchema.findByIdAndRemove(id);
  }
  async updateProduct(product, id) {
    const updateProduct = await ProductsSchema.findByIdAndUpdate(id, {
    ...product
    });
    return updateProduct;
  }
}

const instance = new ProductRepository();

export default instance;

export { instance };
