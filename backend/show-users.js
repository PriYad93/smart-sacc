import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_Name } from "./src/constants.js";
import { User } from "./src/models/user.model.js";

dotenv.config({ path: "./.env" });

const main = async () => {
  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`);

  const users = await User.find()
    .select("fullname email roll_no username phone_number isVerified createdAt")
    .lean();

  console.log(JSON.stringify(users, null, 2));
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error("Failed to read users:", err);
  process.exit(1);
});
