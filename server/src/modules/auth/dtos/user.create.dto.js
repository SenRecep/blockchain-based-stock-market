import { RoleInfo } from "../../../constants/roleInfo.js";

class UserCreateDto {
  constructor(data, isAdmin) {
    this.name = data.name;
    this.surname = data.surname;
    this.email = data.email;
    this.password = data.password;
    this.identityNumber = data.identityNumber;
    this.publicKey = data.publicKey;
  }
}

export default UserCreateDto;
