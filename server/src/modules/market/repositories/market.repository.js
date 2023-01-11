import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import MarketItemsSchema from "../../../models/MarketItems.schema.js";
import UserRepository from "../../auth/repositories/user.repository.js";
import ProductsSchema from "../../../models/Products.schema.js";

class MarketItemsRepository {
  async getOtherMarketItems(id) {
    const user = await UserRepository.getById(id);
    if (!user)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "marketrepository->getothermarket"
      );
    const product = await ProductsSchema.find({ wallet: { $ne: user.wallet } });
    const foundProducts = await MarketItemsSchema.find({
      inProgress: 1,
      product: product.map((x) => x.id),
    }).populate("product");
    return foundProducts;
  }

  async getUserMarketItems(id) {
    const user = await UserRepository.getById(id);
    if (!user)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "marketrepository->getusermarket"
      );
    const product = await ProductsSchema.find({ wallet: user.wallet });
    const foundProducts = await MarketItemsSchema.find({
      inProgress: 1,
      product: product.map((x) => x.id),
    }).populate("product");
    return foundProducts;
  }
  async getById(id) {
    return await MarketItemsSchema.findById(id).populate("product");
  }

  async createMarketItems(id) {
    const addMarketItems = await MarketItemsSchema.create({
      inProgress: 1,
      product: id,
    });
    await ProductsSchema.findByIdAndUpdate(id, {
      verify: true,
    });
    return addMarketItems;
  }

  async deleteMarketItems(id) {
    const update = await MarketItemsSchema.findOneAndDelete({
      product: id,
    });
    return update;
  }
}

const instance = new MarketItemsRepository();

export default instance;

export { instance };
