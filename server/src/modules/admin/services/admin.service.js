import adminRepository from "../repositories/admin.repository.js";
import UserViewDto from "../../auth/dtos/userView.dto.js";
import MoneyRequestViewDto from "../../auth/dtos/moneyRequest.dto.js";
import UserProductsViewDto from "../../product/dtos/userProducts.dto.js";

class AdminService {
  async createAssistant(user) {
    const created = await adminRepository.createAssistant(user);
    return new UserViewDto(created);
  }
  async updateVerify(id) {
    const update = await adminRepository.updateVerify(id);
    return update;
  }
  async updateMoneyVerify(id) {
    const update = await adminRepository.updateMoneyVerify(id);
    return update;
  }
  async getAllPendingProducts() {
    const products = await adminRepository.getAllPendingProducts();
    return products.map((x) => new UserProductsViewDto(x));
  }
  async getAllProducts() {
    const product = await adminRepository.getAllProducts();
    return product;
  }
  async getAllMoneyRequest() {
    const money = await adminRepository.getAllMoneyRequest();
    const model = money.map((s) => new MoneyRequestViewDto(s));
    return model;
  }
}

const instance = new AdminService();

export default instance;

export { AdminService };
