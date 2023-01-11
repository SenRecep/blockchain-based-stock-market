import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import SwapRequestSchema from "../../../models/SwapRequest.schema.js";
import User from "../../auth/models/User.schema.js";
import MarketItemsSchema from "../../../models/MarketItems.schema.js";
import UserRepository from "../../auth/repositories/user.repository.js";
import ProductsSchema from "../../../models/Products.schema.js";

class SwapRequestRepository {
  async createProduct(product, id) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const marketItemId = await MarketItemsSchema.findById(
      product.toMarketItemId
    );
    const productId = await ProductsSchema.findOne({
      id: marketItemId.product,
    });
    const userWalletId = await User.findOne({ wallet: productId.wallet });
    const createRequest = await SwapRequestSchema.create({
      ...product,
      fromUserId: found.id,
      toUserId: userWalletId.id,
      verify: false,
    });
    return createRequest;
  }
  async getFromRequest(id) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const swapRequest = await SwapRequestSchema.find({
      fromUserId: found.id,
      verify: true,
    });
    return swapRequest;
  }
  async getToRequest(id) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const swapRequest = await SwapRequestSchema.find({
      toUserId: found.id,
      verify: true,
    });
    return swapRequest;
  }
  async getFromNotVerifiedRequest(id) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const swapRequest = await SwapRequestSchema.find({
      fromUserId: found.id,
      verify: false,
    });
    return swapRequest;
  }
  async getToNotVerifiedRequest(id) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const swapRequest = await SwapRequestSchema.find({
      toUserId: found.id,
      verify: false,
    });
    return swapRequest;
  }
  async verifyRequest(id, requestId) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const updatedVerify = await SwapRequestSchema.findByIdAndUpdate(
       requestId ,
      { verify: true },
      { new: true }
    );
    const getFromMarketId = await MarketItemsSchema.findById(
      updatedVerify.fromMarketItemId
    );
    const getToMarketId = await MarketItemsSchema.findById(
      updatedVerify.toMarketItemId
    );
    const getFromUserWalletId = await User.findById(updatedVerify.fromUserId);
    const getToUserWalletId = await User.findById(
      updatedVerify.toUserId
    );
    const updateFromUserId = await ProductsSchema.findOneAndUpdate(
      getFromMarketId.id,
      { wallet: getToUserWalletId.wallet }
    );
    const swapRequest = await ProductsSchema.findOneAndUpdate(getToMarketId.id, {
      wallet: getFromUserWalletId.wallet,
    });
    return updatedVerify;
  }
  // async getRequest(id) {
  //   const swapId = await SwapRequestSchema.findById(id);
  //   const fromMarketItem = await MarketItemsSchema.findById(swapId.fromMarketItemId);
  //   console.log(fromMarketItem);
  //   const toMarketItem = await MarketItemsSchema.findById(swapId.toMarketItemId);
  //   console.log(toMarketItem);
  //   const fromProductId = await ProductsSchema.findById(fromMarketItem.product);
  //   const toProductId = await ProductsSchema.findById(toMarketItem.product);
  //   return {fromProduct:fromProductId,toProduct:toProductId};
  // }
  async getRequest(id) {
    const result= [];
    const swaps = await SwapRequestSchema.find({toUserId:id});
    for(let i = 0;i<swaps.length;i++){
      const swap= swaps[i];
      const fromMarketItem = await MarketItemsSchema.findById(swap.fromMarketItemId);
      const toMarketItem = await MarketItemsSchema.findById(swap.toMarketItemId);
      const fromProductId = await ProductsSchema.findById(fromMarketItem.product);
      const toProductId = await ProductsSchema.findById(toMarketItem.product);
      result.push({id:swap.id,fromProduct:fromProductId,toProduct:toProductId,verify:swap.verify});
    }
    
    return result;
  }
}

const instance = new SwapRequestRepository();

export default instance;

export { instance };
