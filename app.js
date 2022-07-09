const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const teacherData = require("./config/connections").teacherData;
const studentData = require("./config/connections").studentData;
const { Autherize, sessionStore } = require("./config/userSessions");
const studentRoutes = require("./src/routers/studentRouter");
const teacherRoutes = require("./src/routers/teacherRouter");
const app = new express();

// Session  Database object Configuration
app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// use Static resourecs
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// setting ejs view
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.get("/", (req, res) => {
  res.render("home");
});

// SIGNUP Route
app.post("/signup", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  console.log(name, "in signup route");
  res.render("signup", { name, email, password });
});

// REGISTER Route
app.post("/Register", async (req, res) => {
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
    let teachers = teacherData(teacher);
    teachers.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

// LOGOUT Route
app.post("/login", (req, res) => {
  let userEmail = req.body.email;
  let userPassword = req.body.password;
  console.log("user trying to login", userEmail, userPassword);
  teacherData.findOne({ Email: userEmail }).then((result) => {
    // if (result.Password === userPassword) {
    //
    // }
    const checkPassword = bcrypt.compare(userPassword, result.Password);
    if (checkPassword) {
      loggedUser = result.Name;
      req.session.allow = true;
      res.redirect("dash");
    } else {
      console.log("invalid password");
      res.redirect("/");
    }
  });
});

// DASHBOARD Route
app.get("/dash", Autherize, (req, res) => {
  console.log("loged in as ", loggedUser);
  teacherData.findOne({ Name: loggedUser }).then((result) => {
    res.render("dash", { result });
  });
});

// lOGOUT Route
app.get("/logout", (req, res) => {
  loggedUser = null;
  req.session.destroy((err) => {
    if (err) {
      throw err;
    }
    console.log("Session destroyed succesfully");
  });
  res.redirect("/");
});

// ALL ROUTES REGARDING STUDENT DATA
app.use("/students", studentRoutes);
// ALL ROUTES REGARDING TEACHER DATA
app.use("/teachers", teacherRoutes);

app.listen(5000, () => console.log("Server at 5000 port"));

/*****
 *  Only Student Update tab and edit teacher profile are active
 *
 *  all other tabs are kept for further developing
 *
 */
