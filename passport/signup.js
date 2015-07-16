var LocalStrategy = require('passport-local').Strategy;
var mongoose      = require('mongoose');
var User 		  = require('../models/model').User;
var bCrypt 		  = require('bcrypt-nodejs');
var crypto        = require('crypto');
var nodemailer    = require('nodemailer');
var mailoptions = {
  verifyemail: function(user, req, token) {
  	var mailOptions = {
		
	};
  	mailOptions.from = "medamarnadh@gmail.com";
	mailOptions.to =user.email;
    mailOptions.html = [
      'Hi ' + user.username + ',',
      ' Please click on below link to verify your email',
      'http://' + req.headers.host + '/#/verify/' + token
    ].join('\n\n');
	
    mailOptions.subject = 'Email verficatoin ';
	console.log(mailOptions);
    return mailOptions;
  }
};

var transport =  nodemailer.createTransport("SMTP", {
     service: "Gmail",
    auth: {
        user: "medaamarnadh@gmail.com",
        pass: "9705546998"
    }
});
nodemailer = require('nodemailer');
module.exports = function (passport) {
	passport.use('signup',new LocalStrategy({
		            passReqToCallback : true // allows us to pass back the entire request to the callback
	},function(req,username,password,done){
		
		findOrCreateUser = function () {
			
			User.findOne({'username':username},function(err,doc){
				console.log('in the success');	
				if(err)
					done(err);
				else{
					console.log(doc);
					if(doc){
						console.log('in the done')
						
						return 	done(null,false,req.flash('message','Username already exists'));
					}
					 	
					
					var newUser = new User();
						 newUser.username = req.body.username;
						 newUser.password = createHash(req.body.password);
						 newUser.email		= req.body.email;
						 
						     newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('User Registration succesful');    
							  crypto.randomBytes(20, function(err, buf) {
          						var token = buf.toString('hex');								
          						var mailOptions = mailoptions.verifyemail(newUser,req,token);
								newUser.token = token;
								console.log(newUser);
								newUser.save(function(err){
									console.log(err);
								});								
								transport.sendMail(mailOptions,function(error,response){
									console.log(error);
									console.log(response);
								})
        						});
								
                            return done(null, newUser);
                        });
					
					
				}
			})
		}
	try{
	   findOrCreateUser();
	}catch (err) {
		console.log(err);
	}
	}));
	
	var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}

