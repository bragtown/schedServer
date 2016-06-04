var Calendar = require('../models/calendar')
var User = require('../models/users');
module.exports = {
	getHome:function(req,res){

		console.log(req.user);
		res.send({redirect:"home"});
	},
	makeCalendar:function(req,res){
		Calendar.findOne({'name':req.body.calName}, function(err, calendar){
			if(err)
				console.log(err)
			else if(calendar){
				res.send({message:'Calendar Name in Use'})
			}
			else{
				User.findOne({'local.email': req.user.local.email}, function(err, user){
					user.curCalendar = req.body.calName
					user.save(function(err){
						if(err)
							console.log('err:', err);
						else{
							var newCal = new Calendar();
							newCal.name = req.body.calName;
							newCal.users = [req.user.local.email];
							newCal.save(function(err){
								if(err)
									console.log("err:",err);
								else{
									res.send({
										redirect:'home.day'
									})
								}
							});
						}
					});
				});
			}
		})
	}
}