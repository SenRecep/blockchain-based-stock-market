import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import { getLocalDate } from "../../../helpers/localTimeHelper.js";
import ProductsSchema from "../../../models/Products.schema.js";
import MarketItemsSchema from "../../../models/MarketItems.schema.js";
import UserRepository from "../../auth/repositories/user.repository.js";
import ProductRepository from "../../product/repositories/product.repository.js";

class MarketItemsRepository {
  async getOtherMarketItems(id) {
    const user = await UserRepository.getById(id);    
    const foundProducts = await MarketItemsSchema.find({
      inProgress: 1,
    }).populate([{
      path: "product",
      $project:{select:{  wallet: { $ne: user.wallet } } }
      
   }])
    return foundProducts;
  }

  async getUserMarketItems(id) {
    const user = await UserRepository.getById(id);
    const foundProducts = await MarketItemsSchema.find({
      inProgress: 1,
    }).populate({
      path: "product",
      select: { wallet: user.wallet }  
   })
    return foundProducts;
  }
  async getById(id) {
    return await MarketItemsSchema.findById(id);
  }

  async createMarketItems(id) {
    console.log(id);
    const addMarketItems = await MarketItemsSchema.create({
      inProgress: 1,
      product: id,
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
