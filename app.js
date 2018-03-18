const express = require("express");
const bodyParser = require("body-parser");
const nodeFetch = require("node-fetch");

// load our own helper functions
const encode = require("./demo/encode");
const decode = require("./demo/decode");
const Counter = require("./models/Counter");
const Url = require("./models/Url");
const btoa = require("btoa");
const atob = require("atob");

const app = express();
app.use(bodyParser.json());

app.post("/shorten-url", function(req, res, next) {
  console.log(req.body.url);
  const urlData = req.body.url;
  Url.findOne({url:urlData}, function(err,doc){
    if(doc){
      console.log("entry found in db");
      res.send({
        url: urlData,
        hash: btoa(doc._id),
        status: 200,
        status_text = "OK"
      });
    }else {
      console.log("entry NOT FOUND in db, saving NEW");
      const url = new Url({url: urlData});
      url.save(function(err){
        if(err) return console.error(err);
        res.send({
          url: urlData,
          hash: btoa(url._id),
          status: 200,
          status_text = "OK"
        });
      });
    }

  })
});

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

app.get("/:hash", function(req, res) {
  try {
    const hash = req.params.hash;
    const id = atob(hash);
    Url.findOne({_id:id},function(err,doc){
      if (doc) {
        res.status(301).redirect(doc.url);
      } else {
        res.redirect('/');
      }
    });
  } catch (error) {
    res.status(404).send({
      message: `URL with hash value = ${hash} does not exist`
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
