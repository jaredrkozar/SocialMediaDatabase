const common = require("./commonFunctions");
const prompt = require("prompt-sync")();

async function newEmployee() {
    console.log("Inserting 30 random employees into the database...")

    const newEmployees = [];
    console.log(common.createNewEmployee)
    for(let i = 0; i<30;i++) {
        newEmployees.push(common.createNewEmployee());
    }

    var insertEmployeesQuery = "INSERT INTO SocialMedia.employees (employee_name, employee_manager, username, email, currentPassword) VALUES ?";
    
    common.connection.query(insertEmployeesQuery, [newEmployees], (err, res) => {
        console.log("Result", res);
        console.log("Error", err);
    });

    //inserting employee projects
    const newEmployeeProject = [];
    for(let i = 0; i<30;i++) {
        newEmployeeProject.push(common.createNewEmployeeProject(i + 1));
    }

    var insertEmployeeProjectsQuery = "INSERT INTO SocialMedia.employee_project (project_name, project_manager, project_duedate, employee_id) VALUES ?";
    
    common.connection.query(insertEmployeeProjectsQuery, [newEmployeeProject], (err, res) => {
        console.log("Result", res);
        console.log("Error", err);
    });

    //inserting employee department

    const newEmployeeDepartment = [];
    for(let i = 0; i<30;i++) {
        newEmployeeDepartment.push(common.createNewEmployeeDepartment(i + 1));
    }
    console.log(newEmployeeDepartment[1])
    var insertEmployeeDepartmentQuery = "INSERT INTO SocialMedia.employee_department (department_manager, department_name, employee_id) VALUES ?";
    
    common.connection.query(insertEmployeeDepartmentQuery, [newEmployeeDepartment], (err, res) => {
        console.log("Result", res);
        console.log("Error", err);
    });

    //inserting employee assignment

    const newEmployeeAssignment = [];
    for(let i = 0; i<30;i++) {
        newEmployeeAssignment.push(common.createNewEmployeeAssignment(i + 1));
    }

    var insertEmployeeAssignmentQuery = "INSERT INTO SocialMedia.employee_assignment (assignment_name, assignment_duedate, employee_id) VALUES ?";
    
    common.connection.query(insertEmployeeAssignmentQuery, [newEmployeeAssignment], (err, res) => {
        console.log("Result", res);
        console.log("Error", err);
    });
}

async function viewEmployee() {
    const rows = await common.getData('SELECT * FROM SocialMedia.employees ORDER BY username');

    if(rows.length != 0) {
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].username);
        }
    
        const option = prompt("Enter the username of the employee whose info you would like to view");
    
        const userinfo = await common.getData('SELECT * FROM SocialMedia.employees WHERE username = ' + '"' + option + '"');
    
        console.log("\n");
        console.log('User info for ' + userinfo[0].username + ": ");
    
        console.log('Name ' + userinfo[0].employee_name);
        console.log('Manager ' + userinfo[0].employee_manager);
        console.log('Username ' + userinfo[0].username);
        console.log('Email ' + userinfo[0].email);
    
        const departmentInfo = await common.getData('SELECT * FROM SocialMedia.employee_department WHERE employee_id = ' + '"' + userinfo[0].employee_id + '"');
    
        console.log('The user is in the ' + departmentInfo[0].department_name + ' department and the departments manager is ' + departmentInfo[0].department_manager );
    
        const projectInfo = await common.getData('SELECT * FROM SocialMedia.employee_project WHERE employee_id = ' + '"' + userinfo[0].employee_id + '"');
    
        console.log('The employees current project is ' + projectInfo[0].project_name + ' , the projects manager is ' + projectInfo[0].project_manager + 'and the rojecta due date is ' + projectInfo[0].project_duedate );
    
        const assignmentInfo = await common.getData('SELECT * FROM SocialMedia.employee_assignment WHERE employee_id = ' + '"' + userinfo[0].employee_id + '"');
        
        console.log('The employees current assignment is ' + assignmentInfo[0].assignment_name + ' , the assignments due date is ' + assignmentInfo[0].assignment_duedate);
    
    } else {
        console.log("you need to hire some users!")
    }
}

async function removeEmployee() {
    const rows = await common.getData('SELECT * FROM SocialMedia.employees ORDER BY username');

    if(rows.length != 0) {
        for(let i = 0; i<rows.length;i++) {
            console.log(rows[i].username);
        }
    
        const option = prompt("Enter the username of the employee who you want to remove");
    
        const employeeID = await common.getData('SELECT * FROM SocialMedia.employees WHERE username = ' + '"' + option + '"');
    
        await common.getData("DELETE FROM SocialMedia.employees WHERE employee_id = " + "'" + employeeID[0].employee_id + "'");
    } else {
        console.log("you need to hire some users!")
    }
}

module.exports = {newEmployee, viewEmployee, removeEmployee}