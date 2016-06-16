global.__base = __dirname + '/';
global.config = require(__base + '/config.js');

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var passport = require('passport');
var myStrategy = require(__base + '/config/passport.js');
var morgan = require('morgan');
var fs = require('fs');

mongoose.connect(config.mongoConnectionString);
mongoose.connection.on('error', () => {
  console.log('Connection error');
});
mongoose.connection.once('open', (callback) => {
  console.log('Mongoose connected');
});

var logStream = fs.createWriteStream(__base + '/logfile.log', {flags : 'a'})

app.use('/uploads/', express.static('./uploads'));

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(morgan('combined', {stream : logStream}));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'I see dead people', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

myStrategy(passport);

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		//console.log(req.params.uid);
		next();
	} else {
		// res.sendStatus(401);
		next();
		//console.log(req.params.uid);
	}
}

app.use('/auth', require(__base + 'routes/auth.js'));
app.use('/', require(__base + 'routes/index.js'));
app.use('/users', require(__base + 'routes/users.js'));
app.use('/users/:uid/docs', isLoggedIn, require(__base + 'routes/docs.js'));
//app.use('/users/:uid/docs/:did/ref', require(__base + 'routes/ref.js'));
app.use('/statistic', require(__base + 'routes/statistic.js'));
app.use('/logout', require(__base + 'routes/logout.js'));

//var port = process.env.PORT || 8080;

app.listen(config.port, function() {
  console.log('Im Online');
})