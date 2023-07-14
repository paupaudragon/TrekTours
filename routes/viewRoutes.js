const express = require("express");
const viewCOntroller = require('./../controllers/viewController')
const router = express.Router();


router.get("/", viewCOntroller.getOverview);
router.get("/tour", viewCOntroller.getTour);

module.exports = router;
