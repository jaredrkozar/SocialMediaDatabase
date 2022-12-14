var { faker } = require('@faker-js/faker');
var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Zelda314",
});

  async function getData(query, array, shouldReturn) {
    try {
        const mysql2 = require('mysql2/promise');
      const database = await mysql2.createConnection({
        host: "localhost",
        user: "root",
        password: "Zelda314",
    });
    
    database.query('SET GLOBAL connect_timeout=28800')
    database.query('SET GLOBAL wait_timeout=28800')
    database.query('SET GLOBAL interactive_timeout=28800')

    console.log("SQL Query " + query)
      const [rows, fields] = await database.query(query, array);
      database.end();
      return shouldReturn == true ? rows : null;
    } catch (err) {
      console.log('An error occurred while fetching the sql: ', err);
    }
  }

  function createFakeTweet(personID) {
    return [
        faker.hacker.phrase(),
        faker.date.past(),
        personID,
    ];
    }
    
    function createFakeUrl(num) {
      return [
        faker.internet.url(),
        num,
    ];
    }

    
    function createNewUser() {
        const first = faker.name.firstName();
        const last = faker.name.lastName();
    return [
        first,
        last,
        first + last,
        faker.internet.password(),
        faker.image.avatar(),
        faker.lorem.lines(1),
        faker.phone.number(),
        faker.date.past(),
    ];
    }

    function createNewEmployee() {
      const fullName = faker.name.fullName();
      const userName = fullName.replace(" ", "");
  return [
    fullName,
    faker.name.fullName(),
    userName,
    faker.internet.email(),
    faker.internet.password()
  ];
  }

  function createNewEmployeeProject(num) {
  return [
      faker.hacker.ingverb(),
      faker.name.fullName(),
      faker.date.past(),
      num,
  ];
}

function createNewEmployeeDepartment(num) {
  const departmentNames = ['Accounting', 'HR', 'Technologt', 'Design', 'Legal', 'Marketing', 'Customer Support', 'Trust and Safety', 'Operations', 'Strategy', 'Tech Support', 'Administration'];

  return [
		faker.name.fullName(),
    departmentNames[Math.floor(Math.random() * departmentNames.length)],
      num,
];
}

function createNewEmployeeAssignment(num) {
  return [
    faker.hacker.ingverb(),
    faker.date.past(),
    num,
];
}

  module.exports = { getData, connection, createFakeTweet, createFakeUrl, createNewUser, createNewEmployee, createNewEmployeeProject, createNewEmployeeDepartment, createNewEmployeeAssignment }