import OtherProductsViewDto from "../../product/dtos/otherProduct.dto.js";

class UserMarketItemsViewDto {
    constructor(products) {
      this.inProgress = products.inProgress;
      this.createTime = products.createTime;
      if(products.product)
        this.product = new OtherProductsViewDto(products.product);
    }
  }
  
  export default UserMarketItemsViewDto;
  