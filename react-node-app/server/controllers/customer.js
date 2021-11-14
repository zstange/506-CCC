const  db  = require('../db.js')
const { bcrypt, saltRounds} = require('../hash.js')

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
      if(err){
        return res.send({err: "db query error"});
      }
      else if (result != ""){
        var redir = { redirect: "/login" };
        return res.json(redir);
      }
    });
   })
   
    
},

addAppointment(req, res){
    const uid = req.body.uid
    const vid = req.body.vid
    const dateTime = req.body.dateTime
    const service = req.body.service
    const additionalInfo = req.body.additionalInfo
    const status = "Not Ready"
    const sqlInsert = 
    "INSERT INTO appointmenttable (uid, vid,dateTime,service,additionalInfo,status) VALUES (?,?,?,?,?,?);"
    db.query(sqlInsert, [uid, vid, dateTime, service, additionalInfo, status]
        , (err, result) => {
            if(err){
                res.send({err: "db query error"});
              }
              else if (result != ""){
                var redir = { redirect: "/viewAppointment" };
                return res.json(redir);
              }              
        });
},

getAppointments(req, res){
  const sqlInsert = 
  "SELECT * FROM appointmenttable"
  db.query(sqlInsert
      , (err, result) => {
          if(err){
              res.send({err: err});
            }
            else if (result != ""){
              
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
          if(err){
              res.send({err: err});
            }
            else if (result != ""){
              
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
          if(err){
              res.send({err: err});
            }
            else if (result != ""){
              console.log(result.length)
              return res.json({length: result.length});
            }
            else{
              return res.json({length: 0});
            }
      });
},

getVehicles(req, res){
  const uid = req.body.uid

  const sqlInsert = 
  "SELECT vid, make, model, year, color, licensePlate FROM vehicletable WHERE uid = ?"
  db.query(sqlInsert, [uid]
      , (err, result) => {
          if(err){
              res.send({err: err});
            }
            else if (result != ""){
              
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
      if(err){
        return res.json({err: err});
      }
      else if (result != ""){
        bcrypt.hash(password,saltRounds, (err, hash) =>{
          if(err){
            return res.send({err: "cannot hash password"});
          }
          const sqlInsert = 
          "UPDATE usertable SET password = ? WHERE email = ?";
          db.query(sqlInsert, [hash,email]
            , (err, result) => {
            if(err){
              return res.send({err: "db query error"});
            }
            else if (result != ""){
              var redir = { redirect: "/login" };
              return res.json(redir);
            }
          });
         })
      }
      else{
        res.send({message: "Please fill out all information required."})
      }

      });
},

checkEmail(req, res){
  const email = req.body.email 

  const sqlInsert = 
  "SELECT uid FROM usertable WHERE email = ?"
  db.query(sqlInsert, [email], (err, result) => {
    if(err){
      return res.json({err: err});
    }
    else if (result != ""){
      return res.json({value: true});
      
    } else{
      return res.json({value: false});
    }
  });

},
editAppointment(req, res){
  const aid = req.body.aid
  const vid = req.body.vid
  const dateTime = req.body.dateTime
  const service = req.body.service
  const additionalInfo = req.body.additionalInfo
  const status = "Not Ready"
  const sqlInsert = 
"UPDATE appointmenttable SET vid = ?, dateTime = ?, service = ?, additionalInfo = ?, status = ? WHERE aid = ?;"
db.query(sqlInsert, [vid, dateTime, service, additionalInfo, status, aid], (err, result) => {

  if(err){
    res.send({err: err});
  }
  else if (result != ""){
    var redir = { redirect: "/viewAppointment" };
    return res.json(redir);
  }
  else{
    res.send({message: "Please fill out all information required."})
  }

});

},
deleteAppointment(req, res){
  const aid = req.body.aid
  const sqlInsert = 
"DELETE FROM appointmenttable WHERE aid = ?;"
db.query(sqlInsert, [aid], (err, result) => {

  if(err){
    res.send({err: err});
  }
  else if (result != ""){
    var redir = { redirect: "/viewAppointment" };
    return res.json(redir);
  }
  else{
    res.send({message: "Appointement is not found!"})
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
        return res.send({err: err});
      }
      else if (result != ""){
        var redir = { redirect: "/viewVehicles" };
        return res.json(redir);
      }
      else{
        return res.send({message: "Please fill out all information required."})
      }
});

},
deleteVehicle(req, res){
  const vid = req.body.vid
  const sqlInsert = 
"DELETE FROM vehicletable WHERE vid = ?;"
db.query(sqlInsert, [aid], (err, result) => {

  if(err){
    res.send({err: err});
  }
  else if (result != ""){
    var redir = { redirect: "/viewVehicles" };
    return res.json(redir);
  }
  else{
    res.send({message: "Vehicle is not found!"});
  }

});

},
getUser(req, res){
	const uid = req.body.uid
    const sqlInsert = 
    "SELECT * FROM usertable WHERE uid = ?"
    db.query(sqlInsert, [uid]
        , (err, result) => {
            if(err){
                res.send({err: err});
              }
              else if (result != ""){
                var user = JSON.parse(JSON.stringify(result));
				return res.json(user);
              }
              else{
                res.send({message: "cannot get user information"})
              }
        });
},


};
module.exports = customerController;