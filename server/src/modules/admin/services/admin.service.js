import adminRepository from "../repositories/admin.repository.js";
import UserViewDto from "../../auth/dtos/userView.dto.js";

class AdminService {
  async createAssistant(user) {
    const created = await adminRepository.createAssistant(user);
    return new UserViewDto(created);
  }
  async updateVerify(id) {
    const update = await adminRepository.updateVerify(id);
    return update;
  }
  async getAllPendingProducts() {
    const product = await adminRepository.getAllPendingProducts();
    return product;
  }
  async getAllProducts() {
    const product = await adminRepository.getAllProducts();
    return product;
  }
}

const instance = new AdminService();

export default instance;

export { AdminService };
