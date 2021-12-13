const mysql = require('mysql')


db = mysql.createPool({
	host: 'us-cdbr-east-05.cleardb.net',
	user: 'b99b8d5d71ad9b',
	password: '4878b4aa824cdda',
	database: 'heroku_d5c4d8c4cad6eb6'
});

module.exports = db;