import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const MarketItemsSchema = new Schema({
  product : {
    type: mongoose.Schema.Types.ObjectId,
    ref:"products"
  },
  inProgress: {
    type: Boolean,
    required: [true, "In Progress is required"],
  },
  createTime: {
    type:Date,
    default:Date.now
  }
});

const marketItem = mongoose.model("marketItem", MarketItemsSchema);

export default marketItem;
