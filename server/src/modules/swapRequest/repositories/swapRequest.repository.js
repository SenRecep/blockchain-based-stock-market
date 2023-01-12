import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import SwapRequestSchema from "../../../models/SwapRequest.schema.js";
import User from "../../auth/models/User.schema.js";
import MarketItemsSchema from "../../../models/MarketItems.schema.js";
import UserRepository from "../../auth/repositories/user.repository.js";
import ProductsSchema from "../../../models/Products.schema.js";
import { Transaction } from "../../../../../blockchains/miner-two/block.js";
import blockchainService from "../services/blockchain.service.js";

class SwapRequestRepository {
  async createProduct(product, id) {
    const found = await UserRepository.getById(id);

    const marketItemId = await MarketItemsSchema.findById(
      product.toMarketItemId
    );
    const productId = await ProductsSchema.findOne({
      id: marketItemId.product,
    });
    const toUser = await User.findOne({ wallet: productId.wallet });
    const createRequest = await SwapRequestSchema.create({
      ...product,
      fromUserId: found.id,
      toUserId: toUser.id,
      verify: false,
    });

    console.log(createRequest);
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
  async verifyRequest(data) {
    const found = await UserRepository.getById(data.id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "productrepository->create"
      );
    const updatedVerify = await SwapRequestSchema.findByIdAndUpdate(
      data.requestId,
      { verify: true },
      { new: true }
    );
    const getFromMarketId = await MarketItemsSchema.findById(
      updatedVerify.fromMarketItemId
    );
    const getToMarketId = await MarketItemsSchema.findById(
      updatedVerify.toMarketItemId
    );
    const getFromUserWalletId = await User.findById(
      updatedVerify.fromUserId
    ).populate("wallet");
    const getToUserWalletId = await User.findById(
      updatedVerify.toUserId
    ).populate("wallet");
    const updateFromUserId = await ProductsSchema.findOneAndUpdate(
      getFromMarketId.product,
      { wallet: getToUserWalletId.wallet.id }
    );
    const swapRequest = await ProductsSchema.findOneAndUpdate(
      getToMarketId.product,
      {
        wallet: getFromUserWalletId.wallet.id,
      }
    );
    var tx = new Transaction({
      from: getToUserWalletId.wallet.publicKey,
      to: getFromUserWalletId.wallet.publicKey,
      data: {
        fromUserId: getFromUserWalletId.id,
        toUserId: getToUserWalletId.id,
        fromProductId: updateFromUserId.id,
        toProductId: swapRequest.id,
      },
    });
    tx.sign(data.privateKey);

    await blockchainService.sendTransaction(tx);
    return updatedVerify;
  }

  async getRequest(id) {
    const result = [];
    const swaps = await SwapRequestSchema.find({ toUserId: id });
    for (let i = 0; i < swaps.length; i++) {
      const swap = swaps[i];
      const fromMarketItem = await MarketItemsSchema.findById(
        swap.fromMarketItemId
      );
      const toMarketItem = await MarketItemsSchema.findById(
        swap.toMarketItemId
      );
      const fromProductId = await ProductsSchema.findById(
        fromMarketItem.product
      );
      const toProductId = await ProductsSchema.findById(toMarketItem.product);
      result.push({
        id: swap.id,
        fromProduct: fromProductId,
        toProduct: toProductId,
        verify: swap.verify,
      });
    }

    return result;
  }
}

const instance = new SwapRequestRepository();

export default instance;

export { instance };
