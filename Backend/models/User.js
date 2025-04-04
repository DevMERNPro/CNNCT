import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, sparse: true }, 
    category: { type: [String], default: [] }, 
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
