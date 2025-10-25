const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  done: Boolean,
}, { timestamps: true });

module.exports = mongoose.model("Todo", todoSchema);
