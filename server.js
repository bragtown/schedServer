var express = require('express')  //require express
var config = require('./server/configure')  //require all other modules and use them
var app = express();  //use express. All its functions available via app
var mongoose = require('mongoose');
app.set('port', process.env.PORT || 3000);  //listen on the port
app.set('views', __dirname + '/views'); 
app = config(app);

// mongoose.connect('mongodb://user:cheese@jello.modulusmongo.net:27017/uxiteM7o');
mongoose.connect('mongodb://localhost:27017/scheduler');
mongoose.connection.on('open', function(){
	console.log('Mongoose connected!');
});
var server = app.listen(app.get('port'),function(){
	console.log('Server up: http://localhost:'+ app.get('port'));
});