
function makeRoots($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/');
	
	function loggedin($q,$timeout,$rootScope,$http,$state){
		var deferred = $q.defer();
		console.log('in before loggedin');
		$http.post('/loggedin').success(function(data){	
		  
		   if(data.user){			        		   		
				$rootScope.user = data.user;				
				$rootScope.loggedin = true;			
				console.log('insfslafa');
				$state.go('projects_list');				
				$timeout(deferred.reject);
		    }else{
				console.log('in the resolve');
				$timeout(deferred.resolve);
				}
			
		}).error(function(error){
			alert('in slkfjlsajfa');
		});
		return deferred.promise;
	}
	function checkLogin ($q,$timeout,$rootScope,$http,$state){
		
		var deferred = $q.defer();
		
		if($rootScope.loggedin){			
			$timeout(deferred.resolve);
		}else{
			$http.post('/loggedin').success(function(data){
				if(data.user){					
					$rootScope.loggedin = true;
					$rootScope.user = data.user;
					$timeout(deferred.resolve);
				}else{
					$timeout(deferred.reject);
					$state.go('login');		
				}
			})
			
		}
		return deferred.promise;
			
	}
	
	$stateProvider
		.state('home',{
			url:"/",
			templateUrl:'/views/signup.html',
			resolve:{
				checkLogin :loggedin
			}
		})
		.state('login',{
			url:'/login',
			templateUrl:'/views/login.html',			
			
		})
		
		.state('projects_list',{
			url:'/projects',
			templateUrl:'/views/projects.html',
			resolve:{
				checkLogin:checkLogin
			}
		})
		
		.state('new_project',{
			url:'/new_project',
			templateUrl:'/views/newProject.html',
			resolve:{
				checkLogin:checkLogin
			}
		})
		
		.state('edit_project',{
			url:'/edit_project/:project',
			templateUrl:'/views/editproject.html',
			resolve:{
				checkLogin : checkLogin
			}
		})
		
		.state('verify',{
			url:'/verify/:verify',
			templateUrl:'views/verify.html'
		})
}


function root_controller($scope,$rootScope,$http,$state,$stateParams,$filter){
	
	$scope.user = {
		
	}
	$scope.error = '';
	$scope.gotoLogin = function(){
		console.log('in the login');
		$state.go('login');
	}
	$scope.gotoSignup = function(){
		$state.go('home')
	}
	$rootScope.state = $state;	
	
	$scope.signup = function(){
		console.log($scope.user);
		$http.post('/signup',$scope.user)
			 .success(function(data){				 	
			    $scope.user={};		
				alert('User registered successfully .A verification link sent to your email please check it once');
				$state.go('login');
			 }).error(function(error){		
			    
			 	$scope.error = {
					error:JSON.stringify(error.error)
				}
			 })
	}
	
	$scope.signin = function(){
		console.log($scope.user); 
		$http.post('/login',$scope.user).success(function(data){
			
			$rootScope.user = data.user;			
			$scope.user = data.user;
			$rootScope.loggedin = true;
			console.log('before going to projectslist');
			$state.go('projects_list');			
		}).error(function(err){
						
			$scope.error =err;
			$scope.user = {
				
			};
			
			
		});
	};
	
	$scope.logout = function(){
		$http.get('/signout').success(function(data){
			if(data.message==='success'){
				$state.go('login');
				$scope.user = {
					
				};
				$rootScope.loggedin= false;
			}
				
		});
	};
	
	$scope.gotoNewProject = function(){
		console.log('sdfsdfds sdfdsfsda fdsfsdafas');
		$state.go('new_project');
	};
	
	$scope.project = {
		
	};
	
	$scope.createProject = function(){
		console.log('in create project');
		console.log($scope.project);		
		$http.post('/project',$scope.project).success(function(data){
			$scope.project ={};
			$state.go('projects_list');
		}).error(function(error){			
		    console.log(error);
			$scope.error = error;
		})
	};
	
	/*********** Get list of all projects which are belongs to user ***************/
	$scope.getProjects = function(){
		$http.get('/project').success(function(data){			
			console.log('all projects');
			$scope.projects = data;
		}).error(function(error){
			$scope.error = error;
		});		
	};
	
	/*************** Update project method *****************/
	$scope.editProject = function(){
		
		$http.put('/project',$scope.project).success(function(data){
			$state.go('projects_list');
		}).error(function(error){
			$scope.error = error;
		});
	}
	
	/************ Delete operation for a project *****************/
	$scope.remove = function($index,id){
	    if(confirm('Are you sure to delete the project')){
			$http.delete('/project',{params:{_id:id}}).success(function(data){
				if(data.message ==='success')
					$scope.projects.splice($index,1);				
			}).error(function(error){
				$scope.error = error;
			});
		}
	};
	
	$scope.getProject = function(){
		$http.get('/project?_id='+$stateParams.project).success(function(data){
			console.log('jsdakfjlsdjflsafa');
			console.log(data);			
			data.project.startDate = $filter('date')(data.project.startDate,'yyyy-MM-dd');
			data.project.dueDate = $filter('date')(data.project.dueDate,'yyyy-MM-dd');
			$scope.project = data.project;
		}).error(function(data){
			alert(data);
		})
	};
	
	$scope.verify = function(){
		console.log('in the verify');
		$http.post('/verify',{token:$stateParams.verify}).success(function(data){
			console.log('in ksdjfljsafa');
			$scope.success = true;
		}).error(function(err){
			alert(err);
		})
	}
/****** Make changes when there is a template was changes **************/	
	$rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
		$scope.error = '';
		$scope.project  = {};
	})
	
}


angular.module('node_sample',['ui.router']).run(['$rootScope',function($rootScope){
	
	
}])
.config(makeRoots);

angular.module('node_sample')
	   .controller('root_controller',['$scope','$rootScope','$http','$state','$stateParams','$filter',root_controller])