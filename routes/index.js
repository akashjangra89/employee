var express = require("express");
const { now } = require("mongoose");
var router = express.Router();
const multer = require("multer");
const { dirname } = require("path");
const path = require("path");
const { Z_DATA_ERROR } = require("zlib");
const app = require("../app");
const empDetails = require("../modules/empModule");
const file = require("../modules/file");

const getEmployee = empDetails.find({});

/* GET home page. */
router.get("/", function (req, res, next) {
  getEmployee.exec(function (err, data) {
    if (err) throw err;
    res.render("index", { title: "Employee Details Portal", records: data, success: "" });
  });
});

// Filter

router.post("/search", function (req, res, next) {
  const filterName = req.body.fname;
  const filterEmail = req.body.femail;
  const filterMobile = req.body.fmobile;
  let filterResult;
  if (filterName != "" && filterEmail != "" && filterMobile != "") {
    filterResult = {
      $and: [
        { name: filterName },
        { $and: [{ email: filterEmail }, { mNumber: filterMobile }] },
      ],
    };
  } else if (filterName != "" && filterEmail == "" && filterMobile == "") {
    filterResult = { name: filterName };
  } else if (filterName == "" && filterEmail != "" && filterMobile == "") {
    filterResult = { email: filterEmail };
  } else if (filterName == "" && filterEmail == "" && filterMobile != "") {
    filterResult = { mNumber: filterMobile };
  } else if (filterName != "" && filterEmail != "" && filterMobile == "") {
    filterResult = { $and: [{ name: filterName }, { email: filterEmail }] };
  } else if (filterName != "" && filterEmail == "" && filterMobile != "") {
    filterResult = { $and: [{ name: filterName }, { mNumber: filterMobile }] };
  } else if (filterName == "" && filterEmail != "" && filterMobile != "") {
    filterResult = { $and: [{ email: filterEmail }, { mNumber: filterMobile }] };
  } else {
    filterResult = {};
  }

  const filterEmp = empDetails.find(filterResult);
  filterEmp.exec(function (err, data) {
    if (err) throw err;
    res.render("index", { title: "Employee Details Portal", records: data });
  });
});

// Submit Data

router.post("/", function (req, res, next) {
  const getBody = req.body;

  const submitData = new empDetails({
    name: getBody.name,
    age: getBody.age,
    mNumber: getBody.mNum,
    aNumber: getBody.aNum,
    email: getBody.email,
    department: getBody.department,
    rate: getBody.rate,
    hours: getBody.hours,
    total: parseInt(getBody.rate) * parseInt(getBody.hours),
  });

  submitData.save(function (err, res1) {
    if (err) throw err;
    getEmployee.exec(function (err, data) {
      if (err) throw err;
      res.render("index", {
        title: "Employee Details Portal",
        records: data,
        success: "Data Submitted Successfully",
      });
    });
  });
});

// Delete Data

router.get("/delete/:id", function (req, res, next) {
  const id = req.params.id;
  const delData = empDetails.findByIdAndDelete(id);
  console.log(id);

  delData.exec(function (err) {
    if (err) throw err;
    getEmployee.exec(function (err, data) {
      if (err) throw err;
      res.render("index", {
        title: "Employee Details Portal",
        records: data,
        success: "Data Deleted Successfully",
      });
    });
  });
});

//  Edit

router.get("/edit/:id", function (req, res, next) {
  const id = req.params.id;
  const edit = empDetails.findById(id);
  edit.exec(function (err, data) {
    if (err) throw err;
    res.render("update", { title: "Update Record", records: data });
  });
});

// Update

router.post("/update", function (req, res, next) {
  const getBody = req.body;
  const update = empDetails.findByIdAndUpdate(req.body.id, {
    name: getBody.name,
    age: getBody.age,
    mNumber: getBody.mNum,
    aNumber: getBody.aNum,
    email: getBody.email,
    department: getBody.department,
    rate: getBody.rate,
    hours: getBody.hours,
    total: parseInt(getBody.rate) * parseInt(getBody.hours),
  });
  update.exec(function (err, data) {
    if (err) throw err;
    getEmployee.exec(function (err, data) {
      if (err) throw err;
      res.render("index", {
        title: "Employee Details Portal",
        records: data,
        success: "Data Updated Successfully",
      });
    });
  });
});

// Upload File
router.use(express.static(path.join(__dirname, "./public")));

const Storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: Storage,
}).single("file");

const uploadImage = file.find({});

router.post("/upload", upload, function (req, res, next) {
  const fileName = req.file.filename;
  let success = req.file.filename + "Uploaded Successfully";

  const submitFile = new file({
    file: fileName,
  });

  submitFile.save(function (err) {
    if (err) throw err;
    uploadImage.exec(function (err, data) {
      if (err) throw err;
      res.render("upload", { title: "Upload File Here", success: success, file: data });
    });
  });
});

router.get("/upload", function (req, res, next) {
  uploadImage.exec(function (err, data) {
    if (err) throw err;
    res.render("upload", { title: "Upload File Here", file: data });
  });
});

module.exports = router;
