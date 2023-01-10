import UserCreateDto from "../../auth/dtos/user.create.dto.js";
import adminService from "../services/admin.service.js";
import HttpStatusCodes from "http-status-codes";
import { ServiceResponse } from "../../../common/serviceResponse.js";

export const createAssistant = async (req, res,next) => {
  const addAAssistant = new UserCreateDto(req.body);
  try {
    const data = await adminService.createAssistant(addAAssistant);
    res
      .status(HttpStatusCodes.OK)
      .json(ServiceResponse.successWithData(data, HttpStatusCodes.OK));
  } catch (error) {
    next(error);
  }
};

export const updateVerifyRequest = async (req, res,next) => {
  const {id} = req.body;
  try {
    const data = await adminService.updateVerify(id);
    res
      .status(HttpStatusCodes.OK)
      .json(ServiceResponse.successWithData(data, HttpStatusCodes.OK));
  } catch (error) {
    next(error);
  }
};

export const getAllPendingProductsRequest = async (req, res,next) => {
  try {
    const data = await adminService.getAllPendingProducts();
    res
      .status(HttpStatusCodes.OK)
      .json(ServiceResponse.successWithData(data, HttpStatusCodes.OK));
  } catch (error) {
    next(error);
  }
};

export const getAllProductsRequest = async (req, res,next) => {
  try {
    const data = await adminService.getAllProducts();
    res
      .status(HttpStatusCodes.OK)
      .json(ServiceResponse.successWithData(data, HttpStatusCodes.OK));
  } catch (error) {
    next(error);
  }
};