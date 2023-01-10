import { RoleInfo } from "../../../constants/roleInfo.js";
import userRepository from "../../auth/repositories/user.repository.js";
import ProductsSchema from "../../../models/Products.schema.js";

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
    return update;
  }

  // wallet: { $ne: found.wallet },

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
}

const instance = new AdminRepository();

export default instance;

export { instance };
