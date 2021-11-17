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
  },
  getAppointmentByAppId(req, res){
    const aid = req.body.aid
    const sqlInsert = 
    "SELECT * FROM appointmenttable WHERE aid = ?"
    db.query(sqlInsert, [aid]
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
  getUsers(req, res){
    const sqlInsert = 
    "SELECT uid, firstName, lastName, email, phoneNumber FROM usertable"
    db.query(sqlInsert
        , (err, result) => {
            if(err){
                res.send({err: err});
              }
              else if (result != ""){
                return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length});
              }
              else{
                res.send({message: "cannot get user information"})
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

addInventory(req, res){
    const price = req.body.price
    const make = req.body.make
    const model = req.body.model
    const year = req.body.year
    const color = req.body.color
    const additionalInfo = req.body.additionalInfo
    const image = req.body.image
    const sqlInsert = 
    "INSERT INTO inventorytable (price, make,model,year,color,additionalInfo,image) VALUES (?,?,?,?,?,?,?);"
    db.query(sqlInsert, [price, make, model, year, color, additionalInfo, image]
        , (err, result) => {
            if(err){
                res.send({err: "db query error"});
              }
              else if (result != ""){
                var redir = { redirect: "/viewInventory" };
                return res.json(redir);
              }              
        });
},

editInventory(req, res){
  const iid = req.body.iid
  const price = req.body.price
  const make = req.body.make
  const model = req.body.model
  const year = req.body.year
  const color = req.body.color
  const additionalInfo = req.body.additionalInfo
  const image = req.body.image
    const sqlInsert = 
  "UPDATE inventorytable SET price = ?, make = ?, model = ?, year = ?, color = ?, additionalInfo = ?, image = ? WHERE iid = ?;"
  db.query(sqlInsert, [price, make, model, year, color, additionalInfo, image, iid], (err, result) => {
  
    if(err){
      res.send({err: err});
    }
    else if (result["affectedRows"] != 0){
      var redir = { redirect: "/viewInventory" };
      return res.json(redir);
    }
    else{
      res.send({message: "Vechicle does not exist in inventory!"})
    }
  
  });
  
  },

deleteInventory(req, res){
    const iid = req.body.iid
    const sqlInsert = 
  "DELETE FROM inventorytable WHERE iid = ?;"
  db.query(sqlInsert, [iid], (err, result) => {
  
    if(err){
      res.send({err: err});
    }
    else if (result["affectedRows"] != 0){
      var redir = { redirect: "/viewInventory" };
      return res.json(redir);
    }
    else{
      res.send({message: "Vehicle is not found in Inventory!"})
    }
  
  });
  
  },

};
module.exports = adminController;