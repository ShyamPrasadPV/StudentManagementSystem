const express = require("express");
const router = new express.Router();
const session = require("express-session");
const { teacherData } = require("../../config/connections");
const { sessionStore, Autherize } = require("../../config/userSessions");
const bcrypt = require("bcrypt");

router.use(express.urlencoded({ extended: true }));
router.use(
  session({
    secret: "key",
    saveUninitialized: false,
    store: sessionStore,
    resave: false,
  })
);

// Teacher Profile Edit Form Route
router.get("/edit/:id", Autherize, (req, res) => {
  let id = req.params.id;
  console.log(id);
  teacherData.findOne({ _id: id }).then((result) => {
    res.render("editteacher", { result });
  });
});

// Teacher Profile Submit Route
router.post("/edit/:id", Autherize, async (req, res) => {
  let id = req.params.id;
  try {
    let hashpwd = await bcrypt.hash(req.body.password, 10);
    let teacher = {
      Name: req.body.name,
      Password: hashpwd,
      Email: req.body.email,
      Address1: req.body.Address1,
      Address2: req.body.Address2,
      Department: req.body.department,
      Designation: req.body.designation,
    };
    console.log("entered user", teacher);
    teacherData.updateOne({ _id: id }, teacher);

    teacherData.findOne({ _id: id }).then((result) => {
      console.log(result);
      loggedUser = result.Name;
      res.redirect("dash");
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
