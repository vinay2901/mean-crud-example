var express = require('express');
var router = express.Router();
var project = require('../controllers/project.js');
var User    = require('../models/model.js').User
var users    = require('../controllers/users.js');

module.exports = function(passport){

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	console.log(req.isAuthenticated());
	if (req.isAuthenticated())
		return next();
	else
		return next();
	// if the user is not authenticated then redirect him to the login page
	//res.redirect('/');
}
	/* GET login page. */
	
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
    	
		//res.render('index', { user:req.user });
		console.log('in the root');
		try{
			
		
		 res.render('index'); 
		 }catch(err){
		 	console.log('in the dsjflsaj;fa');
		 	console.log(err);
		 }
	});

	/* Handle Login POST */
	router.post('/login',
	passport.authenticate('login',{failureFlash:true}),function(req,res){
		console.log(req.flash('message'));
		console.log('in login success');
		 if(req.user){
		 	res.send({user:req.user})
		 }
	}); 
		
	router.post('/loggedin',function(req,res){
		console.log(req.isAuthenticated.toString());
		if(req.isAuthenticated()){
			console.log('sdjfkl skdjfkl jsalfj skldjf lasfa');
		return res.send({user:req.user});
		}
		else{ 		
		return res.send({});	
		}
		
	});

	
	
	

	/* Handle Registration POST */	
	router.post('/signup',users.create); 
	
	

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		console.log('sadjf skdjfsj fkjsadlf safsfa');
		res.send({message:'success'});
	});
	
	
	router.route('/project')
		  .post(isAuthenticated,project.create)
		  .get(isAuthenticated,project.read)
		  .put(isAuthenticated,project.update)
		  .delete(isAuthenticated,project.delete);
	
	router.route('/verify')
		  .post(function(req,res){

		  	User.findOne({token:req.body.token},function(err,user){
				console.log(err);
				console.log(user);
				user.token = '';
				user.verified = true;
				user.save(function(err){
					if(!err){
						return res.send({message:'success'});
					
					}
				})
			})
		  })		  
	

	return router;
}





