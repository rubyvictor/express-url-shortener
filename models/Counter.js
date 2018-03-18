const mongoose = require("mongoose");

const CountersSchema
 = new mongoose.Schema({
  _id: { type: String, required: true },
  count: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter",CountersSchema
)

module.exports = Counter;