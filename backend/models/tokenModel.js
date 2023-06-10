
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shareToken: { type: String, required: true },
}, {
  _id: false,
  timestamps: false
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token