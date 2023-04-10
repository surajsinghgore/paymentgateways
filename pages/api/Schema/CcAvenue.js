import mongoose from "mongoose";

const ccAvenueSchema = new mongoose.Schema(
  {
    data: {},
  },
  { timestamps: true }
);

mongoose.models = {};

const ccAvenueDatabaseSchema =
  mongoose.models.ccAvenueDatabaseSchema ||
  mongoose.model("ccavenuedata", ccAvenueSchema);

export default ccAvenueDatabaseSchema;
