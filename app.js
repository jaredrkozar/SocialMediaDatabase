const prompt = require("prompt-sync")();
const user = require('./userFunctions.js');
const employee = require('./employeeFunctions.js');

async function getUserInput() {
    console.log("What would you like to do? Type view-user to view users, type new-tweet to add some sample tweets, type new-user to add a new user, delete-tweet to delete someones tweet, or type delete-account to delete a user. ");
    var option = prompt("");

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
    } else {
        await user.insertUsers();
    }
    console.log("\r\n"); 
    console.log("What would you like to do? Type view-users to view users, type new-tweet to add some sample tweets, type new-user to add a new user, delete-tweet to delete someones tweet, or type delete-account to delete a user.");
    option = prompt("");
}

async function getEmployeeInput() {
    console.log("What would you like to do? Type: \n - new-employee to add a new employee \n - view-employee to view info about an existing employee (department, manager etc.) ");
    var employeeOption = prompt("");

    if (employeeOption =='new-employee') {
        await employee.newEmployee();
    } else if (employeeOption =='view-employee') {
       await employee.viewEmployee();
    } 
}

async function init() {
    console.log("Do you want to view users or employees?");
    var userInput = prompt("");

    if (userInput =='users') {
        await getUserInput();
    } else if (userInput =='employees') {
        await getEmployeeInput();
    } else {
        console.log(userInput);
        return;
    }
}

init();