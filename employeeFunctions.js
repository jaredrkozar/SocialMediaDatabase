const common = require("./commonFunctions");
const prompt = require("prompt-sync")();

async function listEmployees(userPrompt) {
    option = "next"
    var employeeOffset = 0;

    while(option == "next") {

        const userinfo = await common.getData('SELECT * FROM SocialMedia.employees ORDER BY username LIMIT 5 OFFSET ' + employeeOffset, [], true);

        for(let i = 0; i<userinfo.length;i++) {
            console.log(userinfo[i].username);
        }
        employeeOffset = employeeOffset + 5;
        
        option = prompt(userPrompt + " Enter next to view the next 5 employees in the list: ");
    }
    return option
}

async function newEmployee() {
    console.log("Inserting 30 random employees into the database...")

    const newEmployees = [];

    const lastEmployee = await common.getData('SELECT employee_id FROM SocialMedia.employees ORDER BY employee_id', [], true);
    console.log(lastEmployee)
    var lastEmployeeIDNumber = 0;

    if (lastEmployee.length != 0) {
        const lastEmployeeID = lastEmployee[lastEmployee.length - 1]
        lastEmployeeIDNumber = lastEmployeeID.employee_id
    }

    for(let i = lastEmployeeIDNumber; i<lastEmployeeIDNumber + 1000;i++) {
        newEmployees.push(common.createNewEmployee());
    }

    var insertEmployeesQuery = "INSERT INTO SocialMedia.employees (employee_name, employee_manager, username, email, currentPassword) VALUES ?";
    
    await common.getData(insertEmployeesQuery, [newEmployees], false)

    //inserting employee projects
    const newEmployeeProject = [];
     
    console.log("Projects")
    for(let i = lastEmployeeIDNumber; i<lastEmployeeIDNumber + 1000;i++) {
        newEmployeeProject.push(common.createNewEmployeeProject(i + 1));
    }

    var insertEmployeeProjectsQuery = "INSERT INTO SocialMedia.employee_project (project_name, project_manager, project_duedate, employee_id) VALUES ?";
    
    await common.getData(insertEmployeeProjectsQuery, [newEmployeeProject], false)

    //inserting employee department

    const newEmployeeDepartment = [];
    
    console.log("Deprtmants")
    for(let i = lastEmployeeIDNumber; i<lastEmployeeIDNumber + 1000;i++) {
        newEmployeeDepartment.push(common.createNewEmployeeDepartment(i+1));
    }
    
    var insertEmployeeDepartmentQuery = "INSERT INTO SocialMedia.employee_department (department_manager, department_name, employee_id) VALUES ?";
    
    await common.getData(insertEmployeeDepartmentQuery, [newEmployeeDepartment], false)

    //inserting employee assignment

    const newEmployeeAssignment = [];
    for(let i = lastEmployeeIDNumber; i<lastEmployeeIDNumber + 1000;i++) {
        newEmployeeAssignment.push(common.createNewEmployeeAssignment(i+1));
    }

    var insertEmployeeAssignmentQuery = "INSERT INTO SocialMedia.employee_assignment (assignment_name, assignment_duedate, employee_id) VALUES ?";
    
    await common.getData(insertEmployeeAssignmentQuery, [newEmployeeAssignment], false)
}

async function viewEmployee() {
    const rows = await common.getData('SELECT * FROM SocialMedia.employees ORDER BY username', [], true);

    if(rows.length != 0) {

        const employeeID = await listEmployees("Enter the username of the employee whose info you would like to view")

        const userinfo = await common.getData('SELECT * FROM SocialMedia.employees WHERE username = ' + '"' + employeeID + '"', [], true);
    
        console.log("\n");
        console.log('User info for ' + userinfo[0].username + ": ");
    
        console.log('Name ' + userinfo[0].employee_name);
        console.log('Manager ' + userinfo[0].employee_manager);
        console.log('Username ' + userinfo[0].username);
        console.log('Email ' + userinfo[0].email);
       
        const departmentInfo = await common.getData("SELECT * FROM SocialMedia.employee_department WHERE employee_id = " + "'" + userinfo[0].employee_id + "'", [], true);

        console.log('The user is in the ' + departmentInfo[0].department_name + ' department and the departments manager is ' + departmentInfo[0].department_manager );
    
        const projectInfo = await common.getData('SELECT * FROM SocialMedia.employee_project WHERE employee_id = ' + '"' + userinfo[0].employee_id + '"', [], true);
    
        console.log('The employees current project is ' + projectInfo[0].project_name + ' , the projects manager is ' + projectInfo[0].project_manager + 'and the rojecta due date is ' + projectInfo[0].project_duedate );
    
        const assignmentInfo = await common.getData('SELECT * FROM SocialMedia.employee_assignment WHERE employee_id = ' + '"' + userinfo[0].employee_id + '"', [], true);
        
        console.log('The employees current assignment is ' + assignmentInfo[0].assignment_name + ' , the assignments due date is ' + assignmentInfo[0].assignment_duedate);
    
    } else {
        console.log("you need to hire some users!")
    }
}

async function removeEmployee() {
    const rows = await common.getData('SELECT * FROM SocialMedia.employees ORDER BY username', [], true);

    if(rows.length != 0) {
        const employeeUsername = await listEmployees("Enter the username of the employee who you want to remove")
    
        const employeeID = await common.getData('SELECT * FROM SocialMedia.employees WHERE username = ' + '"' + employeeUsername + '"', [], true);
    
        await common.getData("DELETE FROM SocialMedia.employees WHERE employee_id = " + "'" + employeeID[0].employee_id + "'", [], false);
    } else {
        console.log("you need to hire some users!")
    }
}

module.exports = {newEmployee, viewEmployee, removeEmployee}