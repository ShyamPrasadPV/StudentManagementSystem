const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const sessionStore = new MongoDBStore({
  uri: "mongodb://localhost:27017/StudentManagementSessions",
  collection: "Session",
});

const Autherize = (req, res, next) => {
  if (req.session.allow) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = { sessionStore, Autherize };
