import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const SwapRequestSchema = new Schema({
  fromUserId: {
    type: String,
    required: true,
  },
  toUserId: {
    type: String,
    required: true,
  },
  fromMarketItemId: {
    type: String,
    required: true,
  },
  toMarketItemId: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    required: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
});

const SwapRequest = mongoose.model("swaprequest", SwapRequestSchema);

export default SwapRequest;
