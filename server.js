if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const app = require("./app");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, function(err) {
  if (err) throw err;
  console.log("db connected successfully");

  const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${server.address().port}...`);
  });
});