
Instructions:

1.Extract the zip folder

2.Open terminal , go to the extracted folder

3.Execute the following commands

   'npm install'
   
4. Please start 'mongod' database instance in other terminal

5.Then execute the command 'npm start'.

6.Now you can open the application in localhost:3000.

7.Perform signup operation

8.Verifiy the link

9.Perform signin operation

10.Afeter that List of projects will displayed that are belongs to current user . For the first time user visiting 

   only headers are shown for the table.

11.Click on add new project button to create a new project

12. There are some validations for unique name for project . The startDate shoul be greaterthan end date.

13. The applicaton allows peristent login .i.e If the user close the application wihtout logout operation 
    then the server will stores the session id and user id in its session storage until you restart the server.

14.Please check all the project specifications if any one is missing or if you want to suggest any enhancements 
   or errors please send an email . I am always ready to take the response from you . 


Prerequests:
     Node.js

     Mongodb


Technologies :

   Client side
	 1. html
         2.javascript
         3.angular.js
    
   Server side:
         1.node.js
         2.mongodb (backend)
         3.Other npm modules



Note:

Please add email configurations to get a verification mail in 'controllers/users.js' file .

This is mandatory to get an verification email at the time of signup.

