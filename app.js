const express = require("express");
const bodyParser = require("body-parser");
const nodeFetch = require("node-fetch");

// load our own helper functions
const encode = require("./demo/encode");
const decode = require("./demo/decode");
const Counter = require('./models/Counter');
const Url = require('./models/Url');

const app = express();
app.use(bodyParser.json());

const existingURLs = [
  { id: "1", url: "https://www.google.com", hash: "MQ==" },
  { id: "2", url: "https://www.facebook.com", hash: "Mg==" }
];

app.post("/shorten-url", function(req, res) {
  const hash = encode(req.body.url, existingURLs);
const idInt = parseInt(existingURLs.length);
  var newURL = {
    id: (idInt + 1).toString(),
    url: req.body.url,
    hash: hash
  };

  console.log(hash);
  existingURLs.push(newURL);
  res.send(hash);
});

// TODO: Implement functionalities specified in README
app.get("/expand-url/:hash", function(req, res) {
  try {
    const url = decode(req.params.hash, existingURLs);
    
    if (url) {
      res.send({ url: url });
    }
  } catch (error) {
    res.status(404).send({
      message: `There is no long URL registered for hash value ${
        req.params.hash
      }`
    });
  }
});

app.delete("/urls/:hash", function(req, res) {
  try {
    const url = decode(req.params.hash, existingURLs);
    const urlObj = existingURLs.filter(object => object["url"] === url);
    if (urlObj.length !== 0) {
      existingURLs.pop(urlObj);
      res.status(200).send({ url: url });
    } else if (urlObj.length === 0) {
      res.status(404).send({
        message: `There is no long URL registered for hash value ${
          req.params.hash
        }`
      });
    }
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/:someHash", function(req, res) {
  try {
    const url = decode(req.params.someHash, existingURLs);
    if (url) {
      res.status(301).redirect(url);
      res.send("redirecting to url");
    }
  } catch (error) {
    res.status(404).send({
      message: `URL with hash value = ${req.params.someHash} does not exist`
    });
  }
});




app.get("/", function(req, res) {
  res.send({ existingURLs });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.send(err);
});

module.exports = app;
