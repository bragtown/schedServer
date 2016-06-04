var Calendar = require('../models/calendar')
var User = require('../models/users');
path = require('path')


module.exports = {
	logout: function(req,res){
		req.logout();
		res.send({redirect:'login'});
	},
	signup: function(req,res){
		console.log('signed up!');
		res.send({redirect:'home'});
	},
	login: function(req,res){
		console.log('logged in');
		res.send({redirect:'home.day'});
	},
	getAccount:function(req,res){
		Calendar.find({'users':{$in:[req.user.local.email]}}, function(err, calendars){
			if(err)
				console.log(err)
			else{
				res.send({
					email: req.user.local.email,
					fName: req.user.fName,
					lName: req.user.lName,
					curCalendar: req.user.curCalendar,
					userCalendars: calendars
				})
			}
		})
	},
	updateAccount: function(req,res){
		console.log(req.body);
		User.findOne({'local.email':req.user.local.email}, function(err, user){

			var updateRest = function(){
				if(user.fName != req.body.fName && req.body.fName != undefined){
					change = true;
					user.fName = req.body.fName;
					changeMsg += 'fName,';
				}
				if(user.lName != req.body.lName && req.body.lName != undefined){
					change = true;
					user.lName = req.body.lName;
					changeMsg += 'lName,';
				}
				if(req.body.password === req.body.cPassword && req.body.password != undefined){
					change = true;
					user.local.password = user.generateHash(req.body.password);
					changeMsg += 'password,';
				}
				if(user.curCalendar != req.body.curCalendar && user.curCalendar != undefined){
					//ensure the calendar actually exists
					Calendar.find({'name': req.body.curCalendar, 'users':{$in:[req.user.local.email]}}, function(err, calendar){
						if(err)
							console.log(err);
						else{
							//ensure that the user has access to that calendar
							console.log(calendar);
							user.curCalendar = calendar.name;
						}
					})
				}
				if(change){
					user.save(function(err){
						if(err){
							console.log('err:', err);
							throw err;
						}
						console.log("Updating User");
						console.log(changeMsg);
						res.send({
							fName: user.fName,
							lName: user.lName,
							email: user.email,
							message: "success!"
						});
					});
				}
			}

			var change = false;
			var	changeMsg = '';
			if(req.user.local.email != req.body.email && req.body.email != undefined){
				User.findOne({'local.email': req.body.email}, function(err, nUser){
					console.log("login.32 ", err == true, nUser == true);
					if(err){
						res.send({
							fName: user.fName,
							lName: user.lName,
							email: user.email,
							message: "err"
						});
					}
					else if(nUser){
						res.send({
							fName: user.fName,
							lName: user.lName,
							email: user.email,
							message: "email in use!"
						});
					}
					else{
						change = true;
						console.log(change);
						user.local.email = req.body.email;
						changeMsg += 'email,';
					}
					updateRest();
				});
			}
			else{updateRest()}
		});
	}
}
