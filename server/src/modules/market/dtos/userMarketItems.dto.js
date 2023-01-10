import UserProductsViewDto from "../../product/dtos/userProducts.dto.js";

class UserMarketItemsViewDto {
    constructor(products) {
      this.id = products.id;
      this.inProgress = products.inProgress;
      this.createTime = products.createTime;
      if(products.product)
        this.product = new UserProductsViewDto(products.product);
    }
  }
  
  export default UserMarketItemsViewDto;
  