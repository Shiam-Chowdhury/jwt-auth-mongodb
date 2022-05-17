const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: String,
    slug: String,
    tutorials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutorial"
      }
    ]
  });

module.exports = tagSchema;