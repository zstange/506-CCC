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
      return res.send({err: err});
    }
    const sqlInsert = 
    "INSERT INTO usertable (firstName, lastName,email,password,phoneNumber,role, recievePromotions) VALUES (?,?,?,?,?,?,?);"
    db.query(sqlInsert, [firstName, lastName,email,hash,phoneNumber,role,promotions]
      , (err, result) => {
      if(err){
        return res.send({err: err});
      }
      else if (result != ""){
        var redir = { redirect: "/login" };
        return res.json(redir);
      }
      else{
        return res.send({message: "Please fill out all information required."})
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
    "INSERT INTO appointmenttable (uid, vid,dateTime,service,additionalInfo,status) VALUES (?,?,?,?,?);"
    db.query(sqlInsert, [uid, vid, dateTime, service, additionalInfo, status]
        , (err, result) => {
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


getAppointment(req, res){
    const sqlInsert = 
    "SELECT * FROM appointmenttable"
    db.query(sqlInsert
        , (err, result) => {
            if(err){
                res.send({err: err});
              }
              else if (result != ""){
                var appointment = JSON.parse(JSON.stringify(result));
				var appointmentInfo = { appointmentID: appointment[0].aid, userID: appointment[0].uid, vehicleID: appointment[0].vid,
				dateTime: appointment[0].dateTime, service: appointment[0].service, additionalInfo: appointment[0].additionalInfo, status: appointment[0].status, };
				return res.json(appointmentInfo);
              }
              else{
                res.send({message: "cannot get appointment information"})
              }
        });
},

getUsers(req, res){
    const sqlInsert = 
    "SELECT * FROM usertable"
    db.query(sqlInsert
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

forgotPassword(req, res){
  const password = req.body.password
  const email = req.body.email
  const sqlInsert = 
        "UPDATE usertable SET password = ? WHERE email = ?";
  db.query(sqlInsert, [password, email]
      , (err, result) => {
          if(err){
              res.send({err: err});
            }
            else if (result != ""){
              var redir = { redirect: "/login" };
              return res.json(redir);
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

}

};
module.exports = customerController;