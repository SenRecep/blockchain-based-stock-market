class OtherProductsViewDto {
    constructor(product) {
      this.name = product.name;
      this.description = product.description;
      this.image = product.image;
      this.amount = product.amount;
    }
  }
  
  export default OtherProductsViewDto;
  