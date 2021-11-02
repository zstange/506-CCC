
const customerController ={
createAcc(req, res) {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const password = req.body.password
    const phoneNumber = req.body.phoneNumber
    const promotions = req.body.promotions
  
    const sqlInsert = 
    "INSERT INTO usertable (firstName, lastName,email,password,phoneNumber,recievePromotions) VALUES (?,?,?,?,?,?);"
    db.query(sqlInsert, [firstName, lastName,email,password,phoneNumber,promotions]
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
}

};
module.exports = customerController;