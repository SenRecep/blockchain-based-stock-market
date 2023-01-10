import { ServiceResponse } from "../../../common/serviceResponse.js";
import HttpStatusCodes from "http-status-codes";
import MoneyRequestService from "../services/moneyRequest.service.js";


export const postRequest = async  (req, res, next) => {
    try {
      const response = await MoneyRequestService.createRequest(req.user.id,req.body);
      return res
        .status(HttpStatusCodes.CREATED)
        .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
    } catch (error) {
      next(error);
    }
  };

export default {
  postRequest
};
