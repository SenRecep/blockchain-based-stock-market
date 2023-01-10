import MarketService  from "../services/market.service.js";
import { ServiceResponse } from "../../../common/serviceResponse.js";
import HttpStatusCodes from "http-status-codes";


export const postRequest = async  (req, res, next) => {
  const {product} = req.body;
  try {
    const response = await MarketService.createMarketItems(product);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};

export const getOtherMarketItemsRequest = async  (req, res, next) => {
  try {
    const response = await MarketService.getOtherMarketItems(req.user.id);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};
export const deleteMarketItemsRequest = async  (req, res, next) => {
  const {id} = req.body;
  try {
    const response = await MarketService.deleteMarketItems(id);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};
export const getUserMarketItemsRequest = async  (req, res, next) => {
  try {
    const response = await MarketService.getUserMarketItems(req.user.id);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};
export const getByIdRequest = async  (req, res, next) => {
  try {
    const response = await MarketService.getById(req.params.id);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};



export default {
  postRequest,
  getOtherMarketItemsRequest,
  deleteMarketItemsRequest,
  getUserMarketItemsRequest,
  getByIdRequest
};
