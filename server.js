if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const app = require("./app");
const mongoose = require("mongoose");
const Counter = require('./models/Counter');
const Url = require('./models/Url');

const isProduction = process.env.NODE_ENV === "production";

const dbUrl = process.env.MONGODB_URI;
promise = mongoose.connect(dbUrl, function(err) {
  if (err) throw err;
  console.log("db connected successfully");
});

if (!isProduction) {
  mongoose.set("debug", true);
}

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}...`);
});

promise.then(function(db){
  console.log("db connected");
  Url.remove({},function(){
    console.log("Url collection removed.");
  })
  Counter.remove({},function(){
    console.log('Counter collection removed."');
    const counter = new Counter({_id:'url_count',count:1000});
    counter.save(function(err){
      if(err) return console.error(err);
      console.log("counter inserted");
    });
  });
});


