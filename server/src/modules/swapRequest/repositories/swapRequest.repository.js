import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import SwapRequestSchema from "../../../models/SwapRequest.schema.js";
import User from "../../auth/models/User.schema.js";
import MarketItemsSchema from "../../../models/MarketItems.schema.js";
import UserRepository from "../../auth/repositories/user.repository.js";

class SwapRequestRepository {
  async createProduct(product, id, toMarketItemId) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const marketItem = await MarketItemsSchema.findOne({}).populate({
      path: "product",
      select: { id: toMarketItemId },
    });
    if (!marketItem)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const user = await User.findOne({ wallet: marketItem.wallet });
    const createRequest = await SwapRequestSchema.create({
      ...product,
      fromUserId: found.id,
      toUserId: user.id,
      verify: false,
    });
    return createRequest;
  }
  async getFromRequest(id){
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const swapRequest = await SwapRequestSchema.find({fromUserId:found.id,verify:true});
    return swapRequest;
  }
  async getToRequest(id){
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const swapRequest = await SwapRequestSchema.find({toUserId:found.id,verify:true});
    return swapRequest;
  }
  async getFromNotVerifiedRequest(id){
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const swapRequest = await SwapRequestSchema.find({fromUserId:found.id,verify:false});
    return swapRequest;
  }
  async getToNotVerifiedRequest(id){
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const swapRequest = await SwapRequestSchema.find({toUserId:found.id,verify:false});
    return swapRequest;
  }
}

const instance = new SwapRequestRepository();

export default instance;

export { instance };
