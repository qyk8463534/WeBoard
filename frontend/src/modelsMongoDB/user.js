const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {type: String, unique: true},
  password: {type: String, required: true},
  accessToken: {type: String, default: ""}
});
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;