import UserViewDto from "./userView.dto.js"

class MoneyRequestViewDto {
    constructor(market) {
      this.id = market.id;
      this.amount = market.amount;
      this.description = market.description;
      this.createTime = market.createTime;
      this.verify = market.verify;
      if(market.user)
        this.user = new UserViewDto(market.user);
    }
  }
  
  export default MoneyRequestViewDto;
  