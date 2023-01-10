import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import { getLocalDate } from "../../../helpers/localTimeHelper.js";
import User from "../models/User.schema.js";
import UserRepository from "../repositories/user.repository.js";
import MoneyRequestSchema from "../../../models/MoneyRequest.schema.js";

class WalletsRepository {
  getHistory(id) {
    return MoneyRequestSchema.findById(id);
  } 
}

const instance = new WalletsRepository();

export default instance;

export { instance };
