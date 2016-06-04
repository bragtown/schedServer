var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var CalendarSchema = new Schema({
	name:{type:String},
	users:[{type:String}]
});

module.exports = mongoose.model('Calendar', CalendarSchema);