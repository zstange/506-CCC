// server/index.js

const customerController= require('./controllers/customer')
const { app } = require('./server.js')
const { db } = require('./db.js')
const { bcrypt } = require('./hash.js')

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.get("/login", (req, res) => {
  const email = req.body.email
  const password = req.body.password
  console.log(req.body);
  const sqlInsert = 
  "SELECT * FROM usertable WHERE email = ?"
  db.query(sqlInsert, [email], (err, result) => {
    if(err){
      return res.json({err: err});
    }
    else if (result != ""){
      bcrypt.compare(password, result[0].password, (error, response) => {
        if(response){
          var user = JSON.parse(JSON.stringify(result));
          var userInfo = { userID: user[0].uid, role: user[0].role };
          return res.json(userInfo);
        } else{
          return res.json({message: "Wrong username/password combination!"})
        }
      }) 
    } else{
        return res.json({message: "User doesn't exist!"})
    }
    
  });
})

app.post("/createAccount", customerController.createAcc)
app.post("/addAppointment", customerController.addAppointment)
app.post("/forgotPassword", customerController.forgotPassword)


module.exports = {app}