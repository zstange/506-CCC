const { bcrypt, saltRounds} = require('../hash.js')
const { nodemailer, transporter, cron, env } = require('../email.js')

const customerController ={
createAcc(req, res) {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const password = req.body.password
    const phoneNumber = req.body.phoneNumber
    const role = "user"
    const promotions = req.body.promotions
  
   bcrypt.hash(password,saltRounds, (err, hash) =>{
    if(err){
      return res.send({err: "cannot hash password"});
    }
    const sqlInsert = 
    "INSERT INTO usertable (firstName, lastName,email,password,phoneNumber,role, recievePromotions) VALUES (?,?,?,?,?,?,?);"
    db.query(sqlInsert, [firstName, lastName,email,hash,phoneNumber,role,promotions]
      , (err, result) => {
      if (result != ""){
        return res.json({message: "Created an account successfully"});
      }
    });
   })
   
    
},

getAppointmentDates(req, res) {
  const sqlInsert = 
  "SELECT dateTime FROM appointmenttable"
  db.query(sqlInsert
      , (err, result) => {
           if (result != ""){
              return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length});
            }
            else{
              res.send({message: "cannot get appointment information"})
            }
      });
},

getUserAppointments(req, res){
  const uid = req.body.uid
  const sqlInsert = 
  "SELECT * FROM appointmenttable WHERE uid = ?"
  db.query(sqlInsert, [uid]
      , (err, result) => {
            if (result != ""){
              return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length});
            }
            else{
              res.send({message: "cannot get appointment information"})
            }
      });
},

getAppointmentsByDate(req, res){
  const dateTime = req.body.dateTime
  const sqlInsert = 
  "SELECT * FROM appointmenttable WHERE dateTime = ?"
  db.query(sqlInsert, [dateTime]
      , (err, result) => {
           if (result != ""){
              return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length});
            }
            else{
              return res.json({data: [], length: 0});
            }
      });
},

getVehicles(req, res){
  const uid = req.body.uid
  const sqlInsert = 
  "SELECT vid, make, model, year, color, licensePlate FROM vehicletable WHERE uid = ?;"
  db.query(sqlInsert, [uid]
      , (err, result) => {
           if (result != ""){ 
              return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length});
            }
            else{
              res.send({message: "cannot get vehicle information"})
            }
      });
},

forgotPassword(req, res){
  const password = req.body.password
  const email = req.body.email
  const sqlInsert = 
    "SELECT * FROM usertable WHERE email = ?"
    db.query(sqlInsert, [email], (err, result) => {
        if (result != ""){
        bcrypt.hash(password,saltRounds, (err, hash) =>{
          if(err){
            return res.send({err: "cannot hash password"});
          }
          const sqlInsert = 
          "UPDATE usertable SET password = ? WHERE email = ?";
          db.query(sqlInsert, [hash,email]
            , (err, result) => {
              if (result != ""){
                  return res.send({message: "Updated password successfully"});
            }
          });
         })
      }
      else{
        res.send({message: "Please fill out all information required."})
      }

      });
},

resetPassword(req, res){
  const email = req.body.email
  code = "";
  for (let i = 0; i < 8; i++) {
    code += Math.floor(Math.random() * 10);
  }
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Capitol Car Cleaners - Password Reset!',
    text: "Code for resetting password: " + code
  };
  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    return res.send(error);
  } else {
    return res.json({code: code});
  }
  });
  

},

checkEmail(req, res){
  const email = req.body.email 
  const sqlInsert = 
  "SELECT uid FROM usertable WHERE email = ?"
  db.query(sqlInsert, [email], (err, result) => {
     if (result != ""){
      return res.json({value: true}); 
    } else{
      return res.json({value: false});
    }
  });

},

addVehicle(req, res){
  const uid = req.body.uid
  const make = req.body.make
  const model = req.body.model
  const year = req.body.year
  const color = req.body.color
  const licensePlate = req.body.licensePlate
  const additionalInfo = req.body.additionalInfo
  const sqlInsert = 
  "INSERT INTO vehicletable (uid, make, model, year, color, licensePlate, additionalInfo) VALUES (?,?,?,?,?,?,?);"
  db.query(sqlInsert, [uid, make, model, year, color, licensePlate, additionalInfo]
    , (err, result) => {
      if(err){
        return res.send({err: "db query error"});
      }
      else if (result != ""){
        return res.send({message: "Vehicle added successfully"});
      }
});

},
deleteVehicle(req, res){
  const vid = req.body.vid
  const sqlInsert = 
"DELETE FROM vehicletable WHERE vid = ?;"
db.query(sqlInsert, [vid], (err, result) => {
if (result["affectedRows"] != 0){
    return res.send({message: "Vehicle deleted successfully"});
  }
  else{
    res.send({message: "Vehicle is not found!"});
  }

});

},

getUser(req, res){
	const uid = req.body.uid
  const sqlInsert = 
  "SELECT * FROM usertable WHERE uid = ?;"
  db.query(sqlInsert, [uid],
    (err, result) => {
    if (result != ""){
        return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length});
      }
      else{
        res.send({message: "cannot get user information"})
      }
  });
},


};
module.exports = customerController;