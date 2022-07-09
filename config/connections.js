const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb+srv://ShyamPrasadPV:India19997@cluster0.jo0rk.mongodb.net/?retryWrites=true&w=majority"
// ); ----> Not Working

mongoose.connect("mongodb://localhost:27017/SchoolManagement");
const schema = mongoose.Schema;
const teacherSchema = new schema({
  Name: String,
  Email: String,
  Password: String,
  Address1: String,
  Address2: String,
  Department: String,
  Designation: String,
});

const teacherData = mongoose.model("teacherDatas", teacherSchema);

const studentSchema = new schema({
  Name: String,
  AdmissionNo: String,
  Department: String,
  Semester: String,
  Photo: String,
  RollNo: String,
  Mark1: String,
  Mark2: String,
  Mark3: String,
  Mark4: String,
  Mark5: String,
});
const studentData = mongoose.model("StudentDatas", studentSchema);

module.exports = { teacherData, studentData };
