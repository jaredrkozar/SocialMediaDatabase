# SocialMediaDatabase

1. INSTALLING SOFTWARE:

To be able to run the program, you need to have the following packages and software installed:

- NodeJS. TO Install NodeJS follow the instructions on their website: https://nodejs.dev/en/download/

- FakerJS. We use fakerJS to generate the fake data. You can install FakerJS by running "npm install --save-dev @faker-js/faker" on the command line

- Prompt-sync. We use prompt-sync to get user input. TO install prompt-sync run "npm install --save prompt-sync-history" from the command line

- MySQL2. We use mysql2 to make sql queries. To install, run "npm install --save mysql2" from the command line

2. SETTING UP

- Make sure to enter your SQL username and password in the commonfunctions.js file. 

- create a new schema in SQLWorkbench named SocialMedia (or you can choose any name)

- run the tableScripts.sql in SQLWorkbench to create the tables

- If you changed the database name to something other than SocialMedia, make sure to change the SQL calls in the code using find and replace

3. RUNNING THE PROGRAM

- to start, enter node app.js to start the program

- it will ask if if you want to be a user or employee (type end to end the program)

- if you type user, you can then select between creating new users, viewing users, blocking users, liking tweets, deleting tweets and accounts, and following users

- If you are an employee, you have the option of creating new employees, viewing employees, and removing employees

- enter one of the commands to run the selected function. Type back to select between users and employees

NOTE: You may get a ERR TIMOUT error message every so often. This is normal, and to fix it, just run the program again 
