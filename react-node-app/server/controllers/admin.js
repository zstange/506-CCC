const  db  = require('../db.js')
const adminController ={
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
  }
};
module.exports = adminController;