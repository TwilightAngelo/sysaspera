var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res
    .status(200)
    .set({
      'content-type': 'text/html; charset=utf-8',
    })
    .sendFile(__base + 'public/index.html');
});


module.exports = router;
