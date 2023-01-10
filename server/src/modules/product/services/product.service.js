import UserProductsViewDto from "../dtos/userProducts.dto.js";
import ProductRepository from "../repositories/product.repository.js";

class ProductService {
  async getUserProducts(id) {
    const products = await ProductRepository.getUserProducts(id);
    const model = products.map((s) => new UserProductsViewDto(s));
    return model;
  }
  async getUserPendingProducts(id) {
    const products = await ProductRepository.getUserPendingProducts(id);
    const model = products.map((s) => new UserProductsViewDto(s));
    return model;
  }
  async createProduct(product,id) {
    const created = await ProductRepository.createProduct(product,id);
    return new UserProductsViewDto(created);
  }
  async getById(id) {
    const products = await ProductRepository.getById(id);
    return products;
  }
  async updateProduct(product,id) {
    const update = await ProductRepository.updateProduct(product,id);
    return update;
  }
}

const instance = new ProductService();

export default instance;

export { ProductService };
