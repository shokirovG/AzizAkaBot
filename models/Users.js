const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  userName: String,
  name: String,
  userId: Number,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Users = mongoose.model("users", usersSchema);

module.exports = Users;
