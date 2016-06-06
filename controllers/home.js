var Calendar = require('../models/calendar');
var User = require('../models/users');
var Event = require('../models/events');
module.exports = {
	getHome:function(req,res){

		console.log(req.user);
		res.send({redirect:"home"});
	},
	makeCalendar:function(req,res){
		Calendar.findOne({'name':req.body.calName}, function(err, calendar){
			if(err){
				console.log(err)
				res.send({
					message:"Err!",
					status: 500
				})
			}
			else if(calendar){
				res.send({message:'Calendar Name in Use', status: 400})
			}
			else{
				User.findOne({'local.email': req.user.local.email}, function(err, user){
					user.curCalendar = req.body.calName
					user.save(function(err){
						if(err){
							console.log('err:', err);
							res.send({
								message:"Err!",
								status: 500
							})
						}
						else{
							var newCal = new Calendar();
							newCal.name = req.body.calName;
							newCal.users = [req.user.local.email];
							newCal.save(function(err){
								if(err){
									console.log("err:",err);
									res.send({
										message:"Err!",
										status: 500
									})
								}
								else{
									res.send({
										redirect:'home.day',
										message:'Success!',
										status:200
									})
								}
							});
						}
					});
				});
			}
		})
	},
	getQueued: function(req,res){
		Event.find({'calendar':req.user.curCalendar, 'start': {$exists: false}}, function(err, events){
			if(err){
				console.log(err);
			}
			else
				res.send(events);
		})
	},
	getScheduled: function(req,res){
		Event.find({'calendar':req.user.curCalendar, 'start': {$exists: true}}, function(err, events){
			if(err)
				console.log(err);
			else{
				console.log(events);
				res.send(events);
			}
		})
	},
	addEvent: function(req,res){
		var save = true;
		console.log(req.body);
		var multiplier = 1000*60
		var startDate = new Date(Date.parse(req.body.start));
		var endDate = new Date(Date.parse(req.body.end));
		var newEvent = new Event()
		newEvent.eventType = req.body.eventType
		if(req.body.eventType === "Appointment"){
			if(req.body.start){
				newEvent.end = new Date(startDate.getTime() + req.body.duration * multiplier);
			}
		}
		else if(req.body.eventType === "Availability" || req.body.eventType === "Busy"){
			newEvent.duration = (endDate.getTime() - startDate.getTime())/60/1000;
		}
		else{
			res.send({message: "Please enter an event type"});
			save = false;
		}
		if(req.body.start)
			newEvent.start = startDate
		newEvent.person = req.body.person
		newEvent.apptType = req.body.apptType
		newEvent.duration = req.body.duration
		if(req.body.end)
			newEvent.end = endDate
		newEvent.comments = req.body.comments
		if(req.body.bishopricMember)
			newEvent.bishopricMember = req.body.bishopricMember
		else if(!req.body.bishopricMember && req.body.start)
			res.send({message: "Please Select a Bishopric Member", status: 300})
		newEvent.calendar = req.user.curCalendar
		if(req.user.curCalendar && save){
			newEvent.save(function(err){
				if(err){
					console.log(err);
					res.send({
						message:"Err!",
						status: 500
					})
				}
				else{
					res.send({
						message:"Success!",
						status: 200
					})
				}
			});
		}
	},
	updateEvent:function(req,res){
		Event.findOne({'calendar': req.user.curCalendar, '_id':req.body._id}, function(err, event){
			console.log("event:"+event+', body:'+req.body)
			
			var update = true;
			console.log(req.body);
			var multiplier = 1000*60
			var startDate = new Date(Date.parse(req.body.start));
			var endDate = new Date(Date.parse(req.body.end));
			event.eventType = req.body.eventType
			event.end = endDate;
			event.start = startDate;
			event.duration = req.body.duration
			if(req.body.eventType === "Appointment"){
				if(req.body.start){
					event.end = new Date(startDate.getTime() + req.body.duration * multiplier);
				}
			}
			else if(req.body.eventType === "Availability" || req.body.eventType === "Busy"){
				event.duration = (endDate.getTime() - startDate.getTime())/60/1000;
			}
			else{
				res.send({message: "Please enter an event type",status: 300});
				update = false;
			}
			if(req.body.start)
				event.start = startDate
			event.person = req.body.person
			event.apptType = req.body.apptType
			event.duration = req.body.duration
			if(req.body.end)
				event.end = endDate
			event.comments = req.body.comments
			if(req.body.bishopricMember)
				event.bishopricMember = req.body.bishopricMember
			else if(!req.body.bishopricMember && req.body.start)
				res.send({message: "Please Select a Bishopric Member", status: 300})
			event.calendar = req.user.curCalendar
			if(req.user.curCalendar && update){
				event.save(function(err){
					if(err){
						console.log(err);
						res.send({
							message:"Err!",
							status: 500
						})
					}
					else{
						res.send({
							message:"Success!",
							status:200
						})
					}
				});
			}
		});
	},	
	deleteEvent: function(req,res){
		console.log(req.params)
		Event.remove({'_id':req.params.eventId, 'calendar': req.user.curCalendar}, function(err){
			if(err){
				console.log(err)
				res.send({
					message:"Err!",
					status: 500
				})
			}
			else{
				res.send({message:"Deleted", status: 200})
			}
		})
	},
	updateCalendarUsers:function(req,res){
		//make sure the calendar being posted for is the users currently logged in calendar
		if(req.body.name === req.user.curCalendar && req.body.name != undefined){
			//find any new users
			Calendar.findOne({'name': req.body.name, 'users':{$in:[req.user.local.email]}}, function(err, calendar){
				if(err){
					console.log(err);
					res.send({message: "err", status: 500});
				}
				else if(calendar){
					console.log(calendar);
					for(var i = 0; i < req.body.users.length; i++){
						var foundUser = calendar.users.find(function(curUser){
							return curUser === req.body.users[i]
						})
						if(!foundUser){
							console.log(req.body.users[i]);
						}
					}
					calendar.users = req.body.users
					calendar.save(function(err){
						if(err){
							console.log(err)
							res.send({
								message:"Err!",
								status: 500
							})
						}
						else{
							res.send({message:"Success!", status: 200})
						}
					})
				}
				else{
					res.send({message: "No Calendar Found", status: 400})
				}
			});
		}
	}
}