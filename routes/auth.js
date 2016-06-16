var express = require('express');
var router = express.Router();
var User = require(__base + 'models/user.js');
var passport = require('passport');


router.post('/login', //function () {
  passport.authenticate('local', {failureRedirect : '/auth/login'}),
  // console.log(req.body); },
  function(req, res) {
    console.log('in auth');
    console.log(req.user);
    var user = User.findOne({username : JSON.stringify(req.params.username)});
    //console.log(user);
    res.send(req.user);
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.send('Auth successful');
});

module.exports = router;