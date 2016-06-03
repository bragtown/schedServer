
path = require('path')
module.exports = {
	logout: function(req,res){
		req.logout();
		res.send('login');
	},
	signup: function(req,res){
		console.log('signed up!');
		res.send('home');
	},
	login: function(req,res){
		console.log('logged in');
		res.send('home');
	}

}