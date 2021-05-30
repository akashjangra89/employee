const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const empSchema = new mongoose.Schema({
  name: String,
  age: Number,
  mNumber: Number,
  aNumber: Number,
  email: String,
  department: String,
  rate: Number,
  hours: Number,
  total: Number,
});

const empModel = mongoose.model("employeedetails", empSchema);

module.exports = empModel;
