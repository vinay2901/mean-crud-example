
var LocalStrategy = require('passport-local').Strategy;
var mongoose	  = require('mongoose');
var User 			=   require('../models/model').User;
var bCrypt			= require('bcrypt-nodejs'); 	

module.exports = function (passport) {
	console.log('in the login strategey');
	passport.use('login',new LocalStrategy({
		passReqToCallback:true
	},function (req,username,password,done) {
		try{
		console.log('sadfsa dsfsadfsadfa');
		console.log(done.toString());
		
		User.findOne({
			'username':username
		},function (err,doc) {			
			if(err)
				done(err);
			else{
			   //Checks user was exists or not
				if(!doc)
			     return done({status:401,error:'User not found'}, false, req.flash('message', 'User Not found.'));
			   //Verifies password
			   if(!isValidPassword(doc,password))
			   	return done({status:401,error:'Password not matched'},false, req.flash('message','Password is not valid'));
		//Checks verification was completed or not 
			if(!doc.verified)
				return done({status:401,error:'Your email was not verified.Please check your email to compleate v						erification'},false,null);
				
			   return done(null,doc);			                     
			}
		});
		}catch(err){
			console.log(err);
		}
	}));
	
	  var isValidPassword = function(user, password){
	  	 
        return bCrypt.compareSync(password, user.password);
    }	
}	 