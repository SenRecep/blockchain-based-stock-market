class UserViewDto {
  constructor(user) {
    this.id = user.id;
    if(user.role)
      this.role = user.role.name;
    this.name = user.name;
    this.surname = user.surname;
    this.email = user.email;
    this.identityNumber = user.identityNumber;
    this.registrationToken = user.registrationToken;
    this.fullName = `${this.name} ${this.surname}`;
  }
}

export default UserViewDto;
