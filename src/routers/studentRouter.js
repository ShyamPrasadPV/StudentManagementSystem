const express = require("express");
const { studentData } = require("../../config/connections");
const { sessionStore, Autherize } = require("../../config/userSessions");
const session = require("express-session");

const router = express.Router();

// Session configuration For Router
router.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// STUDENT Route
router.get("/", Autherize, (req, res) => {
  studentData.find().then((result) => {
    console.log(result);
    res.render("student", { result });
  });
});

// MORE DETAILED STUDENT PAGE Route
router.get("/more/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);
  studentData.findOne({ _id: id }).then((result) => {
    console.log(result);
    res.render("studentdetails", { result });
  });
});

// ADD STUDENT FORM PAGE ROUTE
router.get("/add", Autherize, (req, res) => {
  res.render("addstudent");
});

// ADD STUDENT FORM SUBMISSION ROUTE
router.post("/add", Autherize, (req, res) => {
  let student = {
    Name: req.body.name,
    AdmissionNo: req.body.AdmNo,
    Department: req.body.department,
    Photo: req.body.filename,
    Semester: req.body.semester,
    RollNo: req.body.rollNo,
    Mark1: req.body.m1,
    Mark2: req.body.m2,
    Mark3: req.body.m3,
    Mark4: req.body.m4,
    Mark5: req.body.m5,
  };
  const Student = studentData(student);
  Student.save();
  res.redirect("/students");
});

// EDIT FORM ROUTE
router.get("/edit/:id", Autherize, (req, res) => {
  let id = req.params.id;
  studentData.findOne({ _id: id }).then((result) => {
    console.log(result);
    res.render("editstudent", { result });
  });
});

// EDIT SUBMIT ROUTE
router.post("/edit/:id", Autherize, (req, res) => {
  let id = req.params.id;
  let Studentdets = {
    Name: req.body.name,
    AdmissionNo: req.body.AdmNo,
    Department: req.body.department,
    Photo: req.body.filename,
    Semester: req.body.semester,
    RollNo: req.body.rollNo,
    Mark1: req.body.m1,
    Mark2: req.body.m2,
    Mark3: req.body.m3,
    Mark4: req.body.m4,
    Mark5: req.body.m5,
  };
  studentData.updateOne({ _id: id }, Studentdets);
  studentData.find().then((result) => {
    console.log(result);
    res.render("student", { result });
  });
});

module.exports = router;
