const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema({
    title: String,
    author: String,
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
      }
    ]
  });

module.exports = tutorialSchema;