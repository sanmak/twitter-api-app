const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const index = require('./routes/index');
const config = require('./config.json');
const dbUtil = require('./model/dbUtil.js');
const users = dbUtil.users;
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/v1', index);

//Initial user setup
app.get('/setup', function(req, res) {

	// create a sample user
	var usersObject = new users({ username: config.username, password: config.password});
	usersObject.save(function(err) {
		if (err){
			res.send({success: false,'Error' : err});
		}
		else{
			res.json({ success: true,message : 'User created successfully'});	
		}
	});
});

// authentication (no middleware necessary since this isnt authenticated)
app.post('/authenticate', function(req, res) {
	users.findOne({username: req.body.username}, function(err, user) {
		if (err){
			res.send({'Error' : err});
		}
		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} 
		else if (user) {
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} 
			else {
				let token = jwt.sign(user, config.secret, {
					expiresIn: config.tokenExpire // expires in 24 hours
				});
				res.json({success: true,token: token});
			}		
		}
	});
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({'error' : 'Page Not found'});
});

module.exports = app;
