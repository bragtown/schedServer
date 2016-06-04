var home = require('../controllers/home');
var login = require('../controllers/login');

module.exports.initialize = function(app, passport, router ){

	router.get('/authenticate', isLoggedIn, home.getHome);
	router.get('/logout', login.logout);
	router.post('/signup', passport.authenticate('local-signup'), login.signup);
	router.post('/login',passport.authenticate('local-login'), login.login);
	router.get('/account', home.getAccount);

	app.use('/', router);
}
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	console.log('in isLoggedIn');
	res.send('login');
}