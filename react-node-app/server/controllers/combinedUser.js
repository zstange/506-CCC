const { bcrypt } = require('../hash.js')
const { jwt, env} = require('../jwt.js')

const combinedUserController = {
    
home(req, res) {
    res.json({ message: "Hello from server!" });
  },

login(req, res){
    const email = req.body.email
    const password = req.body.password
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
            const id = user[0].uid
            const token = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET)
            var userInfo = { userID: user[0].uid, role: user[0].role};
            return res.json({auth: true, token: token, userInfo: userInfo});
          } else{
            return res.send({message: "Wrong username/password combination!"})
          }
        }) 
      } else{
          return res.send({message: "User doesn't exist!"})
      }
      
    });
  },
  addAppointment(req, res){
    const uid = req.body.uid
    const vid = req.body.vid
    const dateTime = req.body.dateTime
    const service = req.body.service
    const additionalInfo = req.body.additionalInfo
    const status = req.body.status
    const sqlInsert = 
    "INSERT INTO appointmenttable (uid, vid,dateTime,service,additionalInfo,status) VALUES (?,?,?,?,?,?);"
    db.query(sqlInsert, [uid, vid, dateTime, service, additionalInfo, status]
        , (err, result) => {
            if(err){
                res.send({err: "db query error"});
              }
              else if (result != ""){
                return res.send({message: "Appointment added successfully"});
              }              
        });
},
editAppointment(req, res){
  const aid = req.body.aid
  const vid = req.body.vid
  const dateTime = req.body.dateTime
  const service = req.body.service
  const additionalInfo = req.body.additionalInfo
  const status = req.body.status
  const sqlInsert = 
"UPDATE appointmenttable SET vid = ?, dateTime = ?, service = ?, additionalInfo = ?, status = ? WHERE aid = ?;"
db.query(sqlInsert, [vid, dateTime, service, additionalInfo, status, aid], (err, result) => {
  if(err){
    res.send({err: err});
  }
  else if (result["affectedRows"] != 0){
    return res.send({message: "Appointment edited successfully"});
  }
  else{
    res.send({message: "appointment doesn't exist in the table."})
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
  else if (result["affectedRows"] != 0){
    return res.send({message: "Appointment deleted successfully"});
  }
  else{
    res.send({message: "Appointement is not found!"})
  }

});
},

getImages(req, res){
  const iid = req.body.iid
  const sqlInsert = 
  "SELECT * FROM imagetable"
  db.query(sqlInsert, [iid]
      , (err, result) => {
          if(err){
              res.send({err: err});
            }
            else if (result != ""){
              return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length});
            }
            else{
              res.send({message: "cannot fetch inventory"})
            }
      });
},

getInventory(req, res){
  const sqlInsert = 
  "SELECT * FROM inventorytable"
  db.query(sqlInsert
      , (err, result) => {
          if(err){
              res.send({err: err});
            }
            else if (result != ""){
              return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length});
            }
            else{
              res.send({message: "cannot fetch inventory"})
            }
      });
},

getPromotions(req, res){
  const sqlInsert = 
  "SELECT * FROM promotiontable"
  db.query(sqlInsert
      , (err, result) => {
          if(err){
              res.send({err: err});
            }
            else if (result != ""){
              return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length});
            }
            else{
              res.send({message: "cannot fetch promotions"})
            }
      });
}

};



module.exports = combinedUserController; 