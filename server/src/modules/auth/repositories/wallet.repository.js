import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import { getLocalDate } from "../../../helpers/localTimeHelper.js";
import WalletsSchema from "../../../models/Wallets.schema.js";
import UserRepository from "../repositories/user.repository.js";

class WalletsRepository {
  getWalletById(id) {
    return WalletsSchema.findById(id);
  } 

//   addMoney(userId) {
//     const found = UserRepository.ifExistUser(user.userId);
//     const add = WalletsSchema.findByIdAndUpdate(
//       found.walletId,
//       {
//         money,
//       },
//       { new: true, useFindAndModify: false }
//     );
//   }
}

const instance = new WalletsRepository();

export default instance;

export { instance };
