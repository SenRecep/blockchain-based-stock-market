import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import UserRepository from "../repositories/user.repository.js";
import MoneyRequestSchema from "../../../models/MoneyRequest.schema.js";

class MoneyRequestRepository {
  async getHistory(id) {
    return await MoneyRequestSchema.findById(id);
  } 
  async createRequest(id,money) {
    const found = await UserRepository.getById(id);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "moneyrepository->create"
      );
    const addMoney = await MoneyRequestSchema.create({
      ...money,
      verify:false,
      user:found.id
    });
    return addMoney;
  }
}

const instance = new MoneyRequestRepository();

export default instance;

export { instance };
