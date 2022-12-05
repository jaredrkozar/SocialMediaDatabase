const prompt = require("prompt-sync")();
const user = require('./userFunctions.js');
const employee = require('./employeeFunctions.js');

async function getUserInput() {
    console.log("What would you like to do? Type: \n - view-user to view users \n - insert-users to insert some random users \n - new-tweet to add some sample tweets \n - new-user to add a new user \n - delete-tweet to delete someones tweet \n - delete-account to delete a user \n - like-tweet to like a users tweet \n - block-user to block a user. ");
    var option = prompt("");

    while(option!= "back") {
        if (option =='view-user') {
            await user.viewUser();
        } else if (option =='insert-users') {
          await user.insertUsers();
        } else if (option =='new-tweet') {
            await user.insertTweets();
        } else if (option =='delete-tweet') {
           await user.deleteTweet();
        } else if (option =='delete-account') {
            await user.deleteAccount();
        } else if (option =='follow-user') {
            await user.followUser();
        } else if (option =='like-tweet') {
            await user.likeTweet();
        } else if (option =='block-user') {
            await user.blockUser();
        }else {
            console.log("\r\n"); 
            console.log("What would you like to do? Type: \n - view-user to view users \n - new-tweet to add some sample tweets \n - new-user to add a new user \n - delete-tweet to delete someones tweet \n - delete-account to delete a user \n - like-tweet to like a users tweet \n - block-user to block a user. ");
            option = prompt("");
        }
        console.log("\r\n"); 
        console.log("What would you like to do? Type: \n - view-user to view users \n - new-tweet to add some sample tweets \n - new-user to add a new user \n - delete-tweet to delete someones tweet \n - delete-account to delete a user \n - like-tweet to like a users tweet \n - block-user to block a user. ");
        option = prompt("");
    }
    init();
}

async function getEmployeeInput() {
    console.log("What would you like to do? Type: \n - new-employee to add a new employee \n - view-employee to view info about an existing employee (department, manager etc.) \n - remove-employee to remove an employee ");
    var employeeOption = prompt("");
    
    while(employeeOption!= "back") {
        if (employeeOption =='new-employee') {
            await employee.newEmployee();
        } else if (employeeOption =='view-employee') {
           await employee.viewEmployee();
        }  else if (employeeOption =='remove-employee') {
            await employee.removeEmployee();
        } else {
            console.log("What would you like to do? Type: \n - new-employee to add a new employee \n - view-employee to view info about an existing employee (department, manager etc.) \n - remove-employee to remove an employee ");
            employeeOption = prompt("");
        }
        console.log("What would you like to do? Type: \n - new-employee to add a new employee \n - view-employee to view info about an existing employee (department, manager etc.) \n - remove-employee to remove an employee ");
        employeeOption = prompt("");
    }
    init();
}

async function init() {
    console.log("Do you want to view users or employees? Type end to terminate the program");
    var userInput = prompt("");

    while (userInput != "end") {
        if (userInput =='users') {
            await getUserInput();
        } else if (userInput =='employees') {
            await getEmployeeInput();
        } else {
            console.log("Do you want to view users or employees?");
            userInput = prompt("");
        }
        console.log("Do you want to view users or employees?");
        var userInput = prompt("");
    }
}

init();