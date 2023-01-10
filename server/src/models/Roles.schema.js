import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const RolesSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
});

const role = mongoose.model("roles", RolesSchema);

export default role;
