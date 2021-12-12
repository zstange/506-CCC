const mysql = require('mysql')


db = mysql.createPool({
	host: 'us-cdbr-east-04.cleardb.com',
	user: 'b0e7f90e82e83f',
	password: 'f4a40336',
	database: 'heroku_68dc0b4ad60f8e6'
});

module.exports = db;