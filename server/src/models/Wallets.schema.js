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
});

const wallet = mongoose.model("wallets", WalletsSchema);

export default wallet;
