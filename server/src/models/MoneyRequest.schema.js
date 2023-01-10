import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const MoneyRequestSchema = new Schema({
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  verify: {
    type: Boolean,
    required:true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"users"
  },
  createTime: {
    type:Date,
    default:Date.now
  }
});

const MoneyRequest = mongoose.model("moneyRequest", MoneyRequestSchema);

export default MoneyRequest;
