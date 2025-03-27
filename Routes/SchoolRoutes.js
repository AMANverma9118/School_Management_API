const express = require("express");
const router = express.Router();

const {schoolController, validateAddSchool} = require("../controllers/schoolController");

router.post("/addSchool", validateAddSchool, schoolController.addSchool);
router.get("/listShortSchool", schoolController.listShortSchool);

module.exports = router;

