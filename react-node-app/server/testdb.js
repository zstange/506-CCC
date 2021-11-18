const mysql = require('mysql')

db = mysql.createPool({
	host: 'us-cdbr-east-04.cleardb.com',
	user: 'b58458d7479138',
	password: 'c10de02a',
	database: 'heroku_0266765e85d0fa2'
});

module.exports = db;