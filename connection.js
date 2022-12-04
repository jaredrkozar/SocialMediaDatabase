
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Zelda314",
});

  async function getData(query) {
    try {
        const mysql2 = require('mysql2/promise');
      const db = await mysql2.createConnection({
        host: "localhost",
        user: "root",
        password: "Zelda314",
    });
    
      const [rows, fields] = await db.query(queryToRun);
      db.end();
      return rows;
    } catch (err) {
      console.log('An error occurred while fetching the sql: ', err);
    }
  }
  module.exports = { getData, connection }