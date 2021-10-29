
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
        var redir = { redirect: "/Login" };
        return res.json(redir);
      }
      else{
        res.send({message: "Please fill out all information required."})
      }
    });
}  
};
module.exports = customerController;