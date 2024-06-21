const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 6, max: 100 },
  email: { type: String, required: true, unique: true, min: 6, max: 100 },
  password: { type: String, required: true, unique: true, min: 6, max: 1024 },
});
let User = mongoose.model("User", userSchema);
module.exports = User;
