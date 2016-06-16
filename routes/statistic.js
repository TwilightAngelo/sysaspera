var express = require('express');
var router = express.Router({mergeParams : true});
var Doc = require(__base + 'models/doc.js');
var User = require(__base + 'models/user.js');
var stat = [];

router.get('/statistic', function( req, res, next ) {
  Doc.find().count( function (err, count) {
  	stat[0] = count;
  });
  User.find().count( function (err, count) {
  	stat[1] = count;
  	var endDate = new Date();
  	res.send('Number of docs in our DB is ' + stat[0] + 'number of usrs is ' + stat[1] + 'smthng mprtnt nfrmtn ' + process.uptime());
  });
});

module.exports = router;