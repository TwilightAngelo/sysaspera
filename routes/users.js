var express = require( 'express' );
var router = express.Router( { mergeParams : true } );
var User = require( __base + 'models/user.js' );
var fs = require( 'fs' );
var crypto = require( 'crypto' );
var chai = require( 'chai' );

function isLoggedIn(req, res, next) {
  if(req.user) {
    //console.log(req.params.uid);
    next();
  } else {
    res.sendStatus(401);
    //console.log(req.params.uid);
    //next();
  }
}

router.get('/', isLoggedIn, function(req, res, next) {
  var date = new Date();
  console.log('called route /users for GET' + '\n' + 'date is: ' + date +'/n' + 'with ip = ' + req.ip);
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /users for GET ' + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  User.find(req.query, function(err, users){
    if (err) {
      next(err);
    } else {
      res.send(users);
    }
  });
});

router.get('/:id', isLoggedIn, function(req, res, next) {
  var date = new Date();
  console.log(req.params);
 // console.log('called route /users/:id for GET' + '\n' + 'date is: ' + date +'\n' + 'with ip = ' + req.ip);
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /users for GET by user ' + req.params.id + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  User.find({_id : req.params.id}, function(err, users){
    if (err) {
      next(err);
    } else {
      res.send(users);
    }
  });
});

router.post('/', function(req,res, next) {
  var date = new Date();
  //console.log('called route /users/:id for POST' + '\n' + 'date is: ' + date +'\n' + 'with ip = ' + req.ip);
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /users for POST ' + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  //console.log(req.body.password);
  console.log(req.body);
  var user = new User({
    username : req.body.username,
    password : crypto.createHash('md5').update(req.body.password).digest("hex"),
  });
  console.log(user);
  user.save(function(err, user) {
    if (err) {
      next(err);
    } else {
      res.send(user);
    }
  });
});

router.delete('/:id', isLoggedIn, function(req, res, next) {
  var date = new Date();
  //console.log('called route /users/:id for DELETE' + '\n' + 'date is: ' + date +'\n' + 'with ip = ' + req.ip);
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /users for DELETE ' + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  User.remove({_id: req.params.id}, function(err) {
    if (err) {
      next(err);
    } else {
      res.send('ok');
    }
  });
});

router.put('/:id', isLoggedIn, function(req, res, next) {
  var date = new Date();
  //console.log('called route /users/:id for PUT' + '\n' + 'date is: ' + date +'\n' + 'with ip = ' + req.ip);
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /users for UPDATE by user ' + req.params.id + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  User.update({_id: req.params.id}, {$set: req.body}, function(err) {
    if (err) {
      next(err);
    } else {
      res.send('ok');
    }
  });
});

module.exports = router;
