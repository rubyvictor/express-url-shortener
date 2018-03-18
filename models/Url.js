const mongoose = require("mongoose");
const Counter = require("../models/Counter");
const express = require("express");

const UrlSchema = new mongoose.Schema({
  _id: { type: Number },
  url: "",
  created_at: ""
});

UrlSchema.pre("save", async function(next) {
  console.log("running pre-save");
  const doc = this;
  await Counter.findByIdAndUpdate(
    { _id: "url_count" },
    { $inc: { count: 1 } },
    await function(err, counter) {
      if (err) return next(err);
      console.log(counter);
      console.log(counter.count);
      doc._id = counter.count;
      doc.created_at = new Date();
      console.log(doc);
      next();
    }
  );
});

const Url = mongoose.model("Url", UrlSchema);

module.exports = Url;
