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
		res.send({redirect:'home.account'});
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
			if(err){

				res.send({
					message:"Err!",
					status: 500
				})
			}
			else if(user){
				var change = false;
				var	changeMsg = '';

				var updateCalendar = function(){
					console.log(user.curCalendar, req.body.curCalendar);
					if(user.curCalendar != req.body.curCalendar && req.body.curCalendar != undefined){
						//ensure the calendar actually exists
						Calendar.findOne({'name': req.body.curCalendar, 'users':{$in:[req.user.local.email]}}, function(err, calendar){
							if(err){
								console.log(err);
								res.send({
									message:"Err!",
									status: 500
								})
							}
							else{
								//ensure that the user has access to that calendar
								console.log(calendar);
								change = true
								user.curCalendar = calendar.name;
								updateRest();
							}
						})
					}
					else{
						updateRest();
					}
				}
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
					if(change){

						user.save(function(err){
							if(err){
								console.log('err:', err);
								res.send({
									message:"Err!",
									status: 500
								})
								throw err;
							}
							else{
								console.log("Updating User");
								console.log(changeMsg);
								res.send({
									fName: user.fName,
									lName: user.lName,
									email: user.local.email,
									curCalendar: user.curCalendar,
									message: "success!",
									status:200
								});
							}
						});
					}
				}

				var updateUsername = function(){
					if(req.user.local.email != req.body.email && req.body.email != undefined){
						User.findOne({'local.email': req.body.email}, function(err, nUser){
							console.log("login.32 ", err == true, nUser == true);
							if(err){
								res.send({
									fName: user.fName,
									lName: user.lName,
									email: user.email,
									message: "err",
									status: 500
								});
							}
							else if(nUser){
								res.send({
									fName: user.fName,
									lName: user.lName,
									email: user.email,
									message: "email in use!",
									status: 300
								});
							}
							else{
								change = true;
								console.log(change);
								user.local.email = req.body.email;
								changeMsg += 'email,';
								updateCalendar()
							}
						});
					}
					else{
						updateCalendar();
					}
				}

				updateUsername();
			}
			else{

				res.send({
					message:"Could not find User!",
					status: 400
				})
			}
		});
	}
}
