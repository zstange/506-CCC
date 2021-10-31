// server/index.js

const express = require("express");
const router = express.Router();

const PORT = process.env.PORT || 3001;

const customerController= require('./controllers/customer')
const app = express();
const mysql = require('mysql')
const cors = require("cors");
const { Router } = require("express");
app.use(express.json());
app.use(cors());

global.db = mysql.createPool({
	host: 'us-cdbr-east-04.cleardb.com',
	user: 'b58458d7479138',
	password: 'c10de02a',
	database: 'heroku_0266765e85d0fa2'
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });


app.get("/login", (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const sqlInsert = 
  "SELECT * FROM testtable WHERE email = ? AND password = ?"
  db.query(sqlInsert,  (err, result) => {
    if(err){
      return res.json({err: err});
    }
    else if (result != ""){
      var user = JSON.parse(JSON.stringify(result));
      var userInfo = { userID: user[0].uid, admin: user[0].role };
      return res.json(userInfo);
    } else{
        return res.json({message: "Wrong username/password combination!"})
    }

    
  });
})

app.post("/CreateAccount", customerController.createAcc)
app.post("/addAppointment", customerController.addAppointment)
app.post("/forgotPassword", customerController.forgotPassword)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = router;