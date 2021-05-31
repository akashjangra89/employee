const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fileSchema = new mongoose.Schema({
  file: String,
});

const fileModel = new mongoose.model("file", fileSchema);

module.exports = fileModel;
