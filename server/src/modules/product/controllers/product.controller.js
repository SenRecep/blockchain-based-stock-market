import ProductService  from "../services/product.service.js";
import { ServiceResponse } from "../../../common/serviceResponse.js";
import HttpStatusCodes from "http-status-codes";


export const postRequest = async  (req, res, next) => {
  try {
    const fileName= `${req.user.id}/${req.file.filename}`;
    req.body.image=fileName;
    const response = await ProductService.createProduct(req.body,req.user.id);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};

export const getUserProductsRequest = async  (req, res, next) => {
  try {
    const response = await ProductService.getUserProducts(req.user.id);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};

export const getUserPendingProductsRequest = async  (req, res, next) => {
  try {
    const response = await ProductService.getUserPendingProducts(req.user.id);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};

export const getByIdRequest = async  (req, res, next) => {
  try {
    const response = await ProductService.getById(req.params.id);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};
export const updateProductRequest = async  (req, res, next) => {
  const {id} = req.body;
  try {
    const response = await ProductService.updateProduct(req.body,id);
    return res
      .status(HttpStatusCodes.CREATED)
      .json(ServiceResponse.successWithData(response,HttpStatusCodes.CREATED));
  } catch (error) {
    next(error);
  }
};



export default {
  postRequest,
  getUserProductsRequest,
  getByIdRequest,
  getUserPendingProductsRequest,
  updateProductRequest
};
