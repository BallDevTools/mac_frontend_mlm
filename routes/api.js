var express = require("express");
var router = express();
const util = require("ethereumjs-util");
const { ethers } = require("ethers");

router.get('/test', function(req, res) {
	res.render('test')
})


module.exports = router;
