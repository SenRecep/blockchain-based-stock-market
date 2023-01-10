import UserViewDto from "../dtos/userView.dto.js";
import moneyRequestRepository from "../repositories/moneyRequest.repository.js";

class MoneyRequestService {
  async createRequest(id,money) {
    const created = await moneyRequestRepository.createRequest(id,money);
    return created;
  }
}

const instance = new MoneyRequestService();

export default instance;

export { MoneyRequestService };
