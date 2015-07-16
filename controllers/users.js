var User = require('../models/model.js').User;
var bCrypt = require('bcrypt-nodejs');
var crypto        = require('crypto');
var nodemailer    = require('nodemailer');

/*************** Email options ********************/
var mailoptions = {
  verifyemail: function(user, req, token) {
  	var mailOptions = {
		
	};
  	mailOptions.from = "wiredelta";
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

/**************** Creating mail transport *******************/
var transport =  nodemailer.createTransport("SMTP", {
     service: "Gmail",
    auth: {
        user: "medaamarnadh@gmail.com",
        pass: "*****************"
    }
});


exports.create = function(req,res){
		User.findOne({'username':req.body.username,'email':req.body.email},function(err,doc){
				console.log('in the success');	
				if(err)
					done(err);
				else{
					console.log(doc);
					if(doc){
						console.log('in the done')
						
						return 	res.status(400).send({error:'Username or email is already in user'});
					}
					 	
					
					var newUser = new User();
						 newUser.username = req.body.username;
						 newUser.password = createHash(req.body.password);
						 newUser.email		= req.body.email;
						 
						     newUser.save(function(err) {
                            if (err){
                             return   res.status(400).send({error:err});
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
								
                            return res.send({message:'success'})
                        });
					
					
				}
			})
}

  var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
