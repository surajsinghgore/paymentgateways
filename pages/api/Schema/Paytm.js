import mongoose from "mongoose";

const paytmSchema = new mongoose.Schema(
  {
    data: {},
  },
  { timestamps: true }
);

mongoose.models = {};

const paytmDatabaseSchema =
  mongoose.models.paytmDatabaseSchema ||
  mongoose.model("paytmdata", paytmSchema);

export default paytmDatabaseSchema;
