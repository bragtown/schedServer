var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaOptions = {
	toObject: {
  		virtuals: true
	},
	toJSON:{
		virtuals: true
	}
};
var EventSchema = new Schema({
	eventType:{type:String},
	start:{type:Date},
	person:{type:String},
	apptType:{type:String},
	duration:{type:Number},
	end:{type:Date},
	comments:{type: String},
	bishopricMember:{type:String},
	calendar:{type:String}

}, schemaOptions);

EventSchema.virtual('backgroundColor').get(function(){
	if(this.eventType === "Availability")
		return "white"
	else if(this.eventType === "Busy")
		return "grey"
	
	if(this.bishopricMember == "Bishop")
		return "blue"
	else if(this.bishopricMember === "1st")
		return "red"
	else if(this.bishopricMember === "2nd")
		return "green"
});
EventSchema.virtual('borderColor').get(function(){
	if(this.bishopricMember == "Bishop")
		return "blue"
	else if(this.bishopricMember === "1st")
		return "red"
	else if(this.bishopricMember === "2nd")
		return "green"
});
EventSchema.virtual('borderColor').get(function(){
	if(this.eventType === "Availability")
		return "black"
	else
		return "white"
});
EventSchema.virtual('scheduled').get(function(){
	if(this.start == undefined)
		return false;
	else
		return true;
});
module.exports = mongoose.model('Event', EventSchema);
//some of these can be virtual fields
//bishopric member and event type are big components in determinging background, border, and text color