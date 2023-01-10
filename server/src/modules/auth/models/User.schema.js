import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { RoleInfo } from "../../../constants/roleInfo.js";

export const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  surname: {
    type: String,
    required: [true, "Surname is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  identityNumber: {
    type: String,
    required: [true, "Identity number is required"],
    unique: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"roles",
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"wallets"
  },
  publicKey: {
    type: String,
    required : false
  }
});

const User = mongoose.model("users", UserSchema);

export default User;
