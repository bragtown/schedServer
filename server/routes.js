var home = require('../controllers/home');
var login = require('../controllers/login');

module.exports.initialize = function(app, passport, router ){

	router.get('/authenticate', isLoggedIn, home.getHome);
	router.get('/logout', login.logout);
	router.post('/signup', passport.authenticate('local-signup'), login.signup);
	router.post('/login',passport.authenticate('local-login'), login.login);
	router.get('/account', isLoggedIn, login.getAccount);
	router.put('/account', isLoggedIn, login.updateAccount);
	router.post('/calendar', isLoggedIn, home.makeCalendar);
	router.get('/queued', isLoggedIn, home.getQueued);
	router.get('/scheduled', isLoggedIn, home.getScheduled);
	router.post('/events', isLoggedIn, home.addEvent);
	router.put('/events', isLoggedIn, home.updateEvent);
	router.delete('/events/:eventId', isLoggedIn, home.deleteEvent);
	router.put('/calendar', isLoggedIn, home.updateCalendarUsers)

	app.use('/', router);
}
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	console.log('in isLoggedIn');
	res.send({redirect:'login'});
}