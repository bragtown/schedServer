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
	bishopricMember:{type:String},
	backgroundColor: {type:String},
	borderColor: {type:String},
	textColor: {type:String},
	scheduled: {type: Boolean}
});
//some of these can be virtual functions
//bishopric member and event type are big components in determinging background, border, and text color