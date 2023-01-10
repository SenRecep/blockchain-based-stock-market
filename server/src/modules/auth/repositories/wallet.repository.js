import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import { getLocalDate } from "../../../helpers/localTimeHelper.js";
import WalletsSchema from "../../../models/Wallets.schema.js";
import UserRepository from "../repositories/user.repository.js";

class WalletsRepository {
  getWalletById(id) {
    return WalletsSchema.findById(id);
  } 
}

const instance = new WalletsRepository();

export default instance;

export { instance };
