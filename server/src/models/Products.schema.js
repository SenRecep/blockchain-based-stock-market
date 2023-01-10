import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const ProductsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  verify: {
    type: Boolean,
    required:true
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"wallets"
  },
  createTime: {
    type:Date,
    default:Date.now
  }
});

const product = mongoose.model("products", ProductsSchema);

export default product;
