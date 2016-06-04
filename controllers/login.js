
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
		res.send({
			email: req.user.local.email,
			fName: req.user.fName,
			lName: req.user.lName
		})
	},
	updateAccount: function(req,res){
		console.log(req.body);
		User.findOne({'local.email':req.user.local.email}, function(err, user){
			var change = false;
			if(req.user.local.email != req.body.email && req.body.email != undefined){
				change = true;
				changeMsg = '';
				User.findOne({'local.email': req.body.email}, function(err, nUser){
					if(err){
						res.send({
							fName: user.fName,
							lName: user.lName,
							email: user.email,
							message: "success!"
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
						user.local.email = req.body.email;
						changeMsg += 'email,';
					}
				});
			}
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
		});
	}
}
