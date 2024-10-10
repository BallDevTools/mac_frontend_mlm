var express = require("express");
var router = express();

router.get('/testbackend', function(req, res, next) {
    res.send('testBackend');
})

module.exports = router;
