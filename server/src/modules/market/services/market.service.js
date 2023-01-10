import UserMarketItemsViewDto from "../dtos/userMarketItems.dto.js";
import OtherMarketItemsViewDto from "../dtos/otherMarketItems.dto.js";
import MarketItemsRepository from "../repositories/market.repository.js";

class MarketService {
  async createMarketItems(id) {
    const created = await MarketItemsRepository.createMarketItems(id);
    return created;
  }
  async getOtherMarketItems(id) {
    const items = await MarketItemsRepository.getOtherMarketItems(id);
    return items.map(item=>new OtherMarketItemsViewDto(item));
  }
  async getUserMarketItems(id) {
    const items = await MarketItemsRepository.getUserMarketItems(id);
    return items.map(item=>new UserMarketItemsViewDto(item));
  }
  async deleteMarketItems(id) {
    const updated = await MarketItemsRepository.deleteMarketItems(id);
    return updated;
  }
  async getById(id) {
    const items = await MarketItemsRepository.getById(id);
    return items;
  }
}

const instance = new MarketService();

export default instance;

export { MarketService };
