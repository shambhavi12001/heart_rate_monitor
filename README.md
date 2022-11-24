# heart_rate_monitor
## endpoint- "http://localhost:3000/createAccount"
## Request type- POST
## Status Codes-
## 1. 201- Account is successfully created
## 2. 400- The new user created was not successfully saved in the database
## 3. 401- An error was ecountered if an invalid email was entered

1. Uses Model.findOne(condition, callback)- The method finds the first document that contains the email entered by the user and uses password hashing, 
2. Creates a document with the name, email and hashed password for a new user and saves it in the database. 
3. Account is uniquely identified by the email id.



