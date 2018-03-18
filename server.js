if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const app = require("./app");
const mongoose = require("mongoose");
const Counter = require('./models/Counter');
const Url = require('./models/Url');

promise = mongoose.connect(process.env.MONGODB_URI, function(err) {
  if (err) throw err;
  console.log("db connected successfully");

  const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${server.address().port}...`);
  });
});

promise.then(function(db){
  console.log("db connected");
  url.remove({},function(){
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


