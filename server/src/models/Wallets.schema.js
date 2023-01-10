import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const WalletsSchema = new Schema({
  money: {
    type: Number,
    required: false,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  publicKey: {
    type: String,
    required : false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"users"
  }
});

const wallet = mongoose.model("wallets", WalletsSchema);

export default wallet;
