var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EventSchema = new Schema({
	eventType:{type:String},
	start:{type:Date},
	person:{type:String},
	apptType:{type:String},
	duration:{type:Number},
	end:{type:Number},
	comments:{type: String},
	bishopricMember:{type:String}
});
