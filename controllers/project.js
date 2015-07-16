


var Project = require('../models/model.js').Project;
exports.create = function(req,res){
	try{
    var startDate = new Date(req.body.startDate);
	var dueDate   = new Date(req.body.dueDate);	
	var no_days = (dueDate.getTime()-startDate.getTime())/1000;
	var errors='';
	
	//Checking date validations
	console.log(no_days);
	if(no_days <=3600){
		return res.status(400).send({error:'Start date should be lessthan due date'});
	}		
	req.body.startDate = startDate
	req.body.dueDate = dueDate;	
	
	
	Project.findOne({name:req.body.name},function(err,doc){
		if(err)
			return 	res.status(400).send({error:err})		
		if(doc){
			//Checkin for douplication
			return res.status(401).send({error:'The project name was already assigned'});
		}
		
		var project	 = new Project(req.body);	
		project.owner = req.user._id;	
		project.save(function(err){
			if(err){
				var keys = Object.keys(err.errors);
				for(var i=0;i<keys.length;i++){
					errors += keys[i]+":"+ err.errors[keys[i]].message+','
				}
				return res.status(401).send({error:errors});
			}else{
				return 	res.send({message:'success'});
			}
		});
		
			
	});
	
	}catch(err){
		console.log(err);
		res.status(500).send({error:err});
	}
};

exports.read = function(req,res){
	//Filters the projects that are belongs to the current user 
	req.query.owner = req.user._id;
	Project.find(req.query,function(err,results){
		console.log(results);
		if(err){
			console.log(req.query);
		}else{
			if(req.query._id)
				return res.send({project:results[0]});
			else
		 	return res.send(results);
		 }
	})
};

exports.update  = function(req,res){
	Project.findOne({_id:{$ne:req.body._id},name:req.body.name},function(err,doc){
		
		
		if(err)
			return res.status(500).send({error:err});
		else if(doc)
		    return res.status(401).send({error:'The project name was already exists'});
			
		Project.update({_id:req.body._id},{$set:req.body},function(err,results){
			if(err){
				res.status(500).send({error:err});
			}else{
				res.send({message:'success'});
			}
		});	
	});
	
};


exports.delete = function(req,res){
	console.log(req.body);
	console.log(req.params);
	console.log(req.query);
	console.log({_id:req.query._id});
	Project.remove({_id:req.query._id},function(err,results){
		if(err){
			
		}else{
			console.log(results);
			res.send({message:'success'});
		}
	});
};