import mongoose from "mongoose";

const stripeSchema = new mongoose.Schema(
  {
    data: {},
  },
  { timestamps: true }
);

mongoose.models = {};

const stripeDatabaseSchema =
  mongoose.models.stripeDatabaseSchema ||
  mongoose.model("stripedata", stripeSchema);

export default stripeDatabaseSchema;
