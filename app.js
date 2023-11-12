var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var googleRouter = require("./routes/google");
var tripAdvisorRouter = require("./routes/tripadvisor");
var stripeRouter = require("./routes/stripe");

var app = express();
app.set("trust proxy", 1);
app.enable("trust proxy");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: [process.env.FRONTEND_URI], // <== URL of our future React app
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/google", googleRouter);
app.use("/tripadvisor", tripAdvisorRouter);
app.use("/stripe", stripeRouter);

module.exports = app;
