let mongoose = require("mongoose");
let validtor = require("validator");
let User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  mail: {
    type: String,
  },
  favoriteFoods: [
    {
      type: String,
    },
  ],
});
module.exports = mongoose.model("user", User);