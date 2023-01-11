import SwapRequestRepository from "../repositories/swapRequest.repository.js";

class SwapRequestService {
  async createProduct(product,id) {
    const created = await SwapRequestRepository.createProduct(product,id);
    return created;
  }
  async getFromRequest(id) {
    const request = await SwapRequestRepository.getFromRequest(id);
    return request;
  }
  async getToRequest(id) {
    const request = await SwapRequestRepository.getToRequest(id);
    return request;
  }
  async getFromNotVerifiedRequest(id) {
    const request = await SwapRequestRepository.getFromNotVerifiedRequest(id);
    return request;
  }
  async getToNotVerifiedRequest(id) {
    const request = await SwapRequestRepository.getToNotVerifiedRequest(id);
    return request;
  }
  async verifyRequest(id,requestId){
    const request = await SwapRequestRepository.verifyRequest(id,requestId);
    return request;
  }
  async getRequest(id){
    const request = await SwapRequestRepository.getRequest(id);
    return request;
  }
}

const instance = new SwapRequestService();

export default instance;

export { SwapRequestService };
