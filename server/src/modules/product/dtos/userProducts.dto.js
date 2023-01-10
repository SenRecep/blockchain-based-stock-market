class UserProductsViewDto {
    constructor(product) {
      this.id = product.id;
      this.name = product.name;
      this.description = product.description;
      this.image = product.image;
      this.amount = product.amount;
      this.verify = product.verify;
      this.createTime = product.createTime;
    }
  }
  
  export default UserProductsViewDto;
  