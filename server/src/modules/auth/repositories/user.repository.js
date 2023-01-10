import User from "../models/User.schema.js";
import bcrypt from "bcrypt";
import { ApiError } from "../../../common/apiError.js";
import HttpStatusCodes from "http-status-codes";
import  WalletsSchema  from "../../../models/Wallets.schema.js";
import role from "../../../models/Roles.schema.js";
import { RoleInfo } from "../../../constants/roleInfo.js";

class UserRepository {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
  async create(user) {
    const found = await this.ifExistUser(user.email);
    if (found != null)
      throw new ApiError(
        "email has been already exist",
        HttpStatusCodes.BAD_REQUEST,
        "userrepository->signup"
      );
    user.password = await this.hashPassword(user.password);
    const createdUser=await User.create(user);
    const foundRole= await role.findOne({name:RoleInfo.user});
    const wallets = await WalletsSchema.create({user:createdUser.id});

    await User.findByIdAndUpdate(
      createdUser.id,
      {
          wallet: wallets.id,
          role:foundRole.id
      },
      { new: true, useFindAndModify: false }
    );
    return createdUser
  }
  ifExistUser(email) {
    return this.getByEmail(email);
  }
  getByEmail(email) {
    return User.findOne({ email: email }).populate("role");
  }
  getAllByRole(role) {
    return User.find({ role });
  }
  getAll() {
    return User.find({});
  }
  getById(id) {
    return User.findById(id);
  }
  async getByEmailAndPassword(email, password) {
    const found = await this.ifExistUser(email);
    if (!found)
      throw new ApiError(
        "Not found user",
        HttpStatusCodes.NOT_FOUND,
        "userrepository->signin"
      );
    const isCompare = await bcrypt.compare(password, found.password);
    if (!isCompare)
      throw new ApiError(
        "Invalid email or password",
        HttpStatusCodes.BAD_REQUEST,
        "userrepository->signin"
      );
    return found;
  }
  deleteById(id) {
    return User.findByIdAndDelete(id);
  }
  async updatePassword({ id, password }) {
    password = await this.hashPassword(password);
    return User.findByIdAndUpdate(id, { password }, { new: true });
  }
  updateToken({ userId, token }) {
    return User.findByIdAndUpdate(
      userId,
      { registrationToken: token },
      { new: true }
    );
  }
}

const instance = new UserRepository();

export default instance;

export { instance };
