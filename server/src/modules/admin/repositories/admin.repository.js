import { RoleInfo } from "../../../constants/roleInfo.js";
import userRepository from "../../auth/repositories/user.repository.js";
import ProductsSchema from "../../../models/Products.schema.js";
import MoneyRequestSchema from "../../../models/MoneyRequest.schema.js";
import WalletsSchema from "../../../models/Wallets.schema.js";
import User from "../../auth/models/User.schema.js";

class AdminRepository {
  createAssistant(user) {
    user.role = RoleInfo.assistant;
    return userRepository.create(user);
  }
  async updateVerify(id) {
    const update = await ProductsSchema.findByIdAndUpdate(
      id,
      { verify: true },
      { new: true }
    );
    console.log(update);
    return update;
  }
  async updateMoneyVerify(id) {
    const update = await MoneyRequestSchema.findByIdAndUpdate(
      id,
      { verify: true },
      { new: true }
    );
    const user = await User.findById(update.user);
    const addMoney = await WalletsSchema.findByIdAndUpdate(user.wallet, {
      $inc: { money: update.amount },
    });
    return update;
  }
  async getAllPendingProducts() {
    const products = await ProductsSchema.find({
      verify: false,
    });
    return products;
  }
  async getAllProducts() {
    const products = await ProductsSchema.find({});
    return products;
  }
  async getAllMoneyRequest() {
    const money = await MoneyRequestSchema.find({
      verify: false,
    }).populate("user");
    return money;
  }
}

const instance = new AdminRepository();

export default instance;

export { instance };
