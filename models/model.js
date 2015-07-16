var mongoose = require('mongoose');
var Schema	 = mongoose.Schema;

var user  =  new Schema ({	

	username: {
		type:String,
		required:true,
		unique:true
	},
	password: {
		type:String,
		required:true
	},
	email: {
		type:String,
		required:true
	},
	verified:{
		type:Boolean,
		default:false
	},
	token :{
		type:String		
	}
	
});





var project = new Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
	description:{
		type:String,
		required:true,
	},
	startDate:{
		type:Date,
		default: new Date(),
		required:true
	},
	dueDate:{
		type:Date,
		required:true,
		required:true
	},
	owner:{
		type:Schema.ObjectId,
		ref:'user'
	}
})


module.exports = {
	User	:mongoose.model('User',user,'users'),
	Project :mongoose.model('Project',project,'projects')
}