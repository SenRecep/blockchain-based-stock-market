import { ServiceResponse } from "../../../common/serviceResponse.js";
import HttpStatusCodes from "http-status-codes";
import SwapRequestService from "../services/swapRequest.service.js";

export const postRequest = async (req, res, next) => {
  try {
    const response = await SwapRequestService.createProduct(
      req.body,
      req.user.id
    );
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response, HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};
export const getFromRequest = async (req, res, next) => {
  try {
    const response = await SwapRequestService.getFromRequest(req.user.id);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response, HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};
export const getToRequest = async (req, res, next) => {
    try {
      const response = await SwapRequestService.getToRequest(req.user.id);
      return res
        .status(HttpStatusCodes.CREATED)
        .json(ServiceResponse.successWithData(response, HttpStatusCodes.CREATED));
    } catch (error) {
      next(error);
    }
  };
  export const getFromNotVerifiedRequest = async (req, res, next) => {
    try {
      const response = await SwapRequestService.getFromNotVerifiedRequest(req.user.id);
      return res
        .status(HttpStatusCodes.CREATED)
        .json(ServiceResponse.successWithData(response, HttpStatusCodes.CREATED));
    } catch (error) {
      next(error);
    }
  };
  export const getToNotVerifiedRequest = async (req, res, next) => {
    try {
      const response = await SwapRequestService.getToNotVerifiedRequest(req.user.id);
      return res
        .status(HttpStatusCodes.CREATED)
        .json(ServiceResponse.successWithData(response, HttpStatusCodes.CREATED));
    } catch (error) {
      next(error);
    }
  };

   export const verifyRequest = async (req, res, next) => {
    const {requestId} = req.body;
    try {
      const response = await SwapRequestService.verifyRequest(req.user.id,requestId);
      return res
        .status(HttpStatusCodes.CREATED)
        .json(ServiceResponse.successWithData(response, HttpStatusCodes.CREATED));
    } catch (error) {
      next(error);
    }
  };
  export const getRequest = async (req, res, next) => {
    const {id} = req.body;
    try {
      const response = await SwapRequestService.getRequest(id);
      return res
        .status(HttpStatusCodes.CREATED)
        .json(ServiceResponse.successWithData(response, HttpStatusCodes.CREATED));
    } catch (error) {
      next(error);
    }
  };

export default {
  postRequest,
  getFromRequest,
  getToRequest,
  getFromNotVerifiedRequest,
  getToNotVerifiedRequest,
  verifyRequest,
  getRequest
};
