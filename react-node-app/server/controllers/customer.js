
const customerController ={
createAcc(req, res) {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password
    const phoneNumber = req.body.phoneNumber
    const email = req.body.email
    const promotions = "false"
  
    const sqlInsert = 
    "INSERT INTO testtable (firstName, lastName,password,phoneNumber,email,promotions) VALUES (?,?,?,?,?,?);"
    db.query(sqlInsert, [firstName, lastName,password,phoneNumber,email,promotions]
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
    const service = req.body.service
    const vehicle = req.body.vehicle
    const date = req.body.date
    const time = req.body.time
    const sqlInsert = 
    "INSERT INTO appointments (uid, service,vehicle,date,time) VALUES (?,?,?,?,?);"
    db.query(sqlInsert, [uid, service, vehicle, date, time]
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
        "UPDATE testtable SET password = ? WHERE email = ?";
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