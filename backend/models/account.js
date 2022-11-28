const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum : ['regular', 'deb', 'savings'], default: 'regular', required: true },
  balance: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Account', accountSchema);
