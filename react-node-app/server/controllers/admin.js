const { nodemailer, transporter, cron, env } = require('../email.js')
const adminController ={
getAppointments(req, res){
    const sqlInsert = 
    "SELECT * FROM appointmenttable"
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
  getAppointmentByAppId(req, res){
    const aid = req.body.aid
    const sqlInsert = 
    "SELECT * FROM appointmenttable WHERE aid = ?"
    db.query(sqlInsert, [aid]
        , (err, result) => {
             if (result != ""){ 
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
            if (result != ""){
                return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length});
              }
              else{
                res.send({message: "cannot get user information"})
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
    const sqlInsert = 
    "INSERT INTO inventorytable (price, make,model,year,color,additionalInfo) VALUES (?,?,?,?,?,?);"
    db.query(sqlInsert, [price, make, model, year, color, additionalInfo]
        , (err, result) => {
             if (result != ""){
                return res.send({message: "Added a vehicle to inventory successfully"});
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
    const sqlInsert = 
  "UPDATE inventorytable SET price = ?, make = ?, model = ?, year = ?, color = ?, additionalInfo = ? WHERE iid = ?;"
  db.query(sqlInsert, [price, make, model, year, color, additionalInfo, iid], (err, result) => {
   if (result["affectedRows"] != 0){
      return res.send({message: "Edited a vehicle in the inventory successfully"});
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
   if (result["affectedRows"] != 0){
      return res.send({message: "Deleted a vehicle in the inventory successfully"});
    }
    else{
      res.send({message: "Vehicle is not found in inventory!"})
    }
  
  });
  
},

addPromotion(req, res){
  const promotionName = req.body.promotionName
  const message = req.body.message
  const sqlInsert = 
  "INSERT INTO promotionTable (promotionName, message) VALUES (?,?);"
  db.query(sqlInsert, [promotionName, message], (err, result) => {
    if (result != ""){
      return res.send({message: "Added a vehicle to inventory successfully"});
    } 
  });
},

deletePromotion(req, res){
  const pid = req.body.pid
  const sqlInsert = 
  "DELETE FROM promotionTable WHERE pid = ?;"
  db.query(sqlInsert, [pid], (err, result) => {
    if (result["affectedRows"] != 0){
      return res.json({message: "Successful deletion!"});
    }
    else{
      res.send({message: "Promotion is not found in Inventory!"})
    }             
  });
},

sendPromotion(req, res){
  const emailBody = req.body.emailBody
  const subject = req.body.subject
  const sqlInsert = 
  "SELECT promotionName, message FROM promotiontable"
  db.query(sqlInsert, (err, result) => {
    if(err){
      return res.send({err: err});
    }
    else if (result != ""){
      const sqlInsert = "SELECT email, recievePromotions FROM usertable"
        db.query(sqlInsert, (err, result) => {
       if (result != ""){
            emails = "";
            for (let i = 0; i < result.length; i++) {
              if(JSON.parse(JSON.stringify(result[i]['recievePromotions'])) == 1){
                emails += JSON.parse(JSON.stringify(result[i]['email'])) + ", ";  
              }
            }
            
              let mailOptions = {
                from: process.env.EMAIL,
                to: emails,
                subject: subject,
                text: emailBody
              };
              transporter.sendMail(mailOptions, function(error, info){});
          return res.json({data: JSON.parse(JSON.stringify(result)), length: result.length, emails: emails});   
          }  
        });
    }
    else{
      return res.send({message: "Promotion is not found in Inventory!"})
    }             
  });
},

editPromotion(req, res){
  const pid = req.body.pid
  const promotionName = req.body.promotionName
  const message = req.body.message
    const sqlInsert = 
  "UPDATE promotionTable SET promotionName = ?, message = ? WHERE pid = ?;"
  db.query(sqlInsert, [promotionName, message, pid], (err, result) => {
  
    if(err){
      res.send({err: err});
    }
    else if (result["affectedRows"] != 0){
      return res.send({message: "edited promotion successfully"});
    }
    else{
      res.send({message: "promotion does not exist in inventory!"})
    }
  
  });
  
},

deleteImages(req, res){
    const iid = req.body.iid
    const sqlInsert = 
    "DELETE FROM imagetable where iid = ?"
    db.query(sqlInsert, [iid], (err, result) => {
     if (result["affectedRows"] != 0){
        return res.json({message: "Successful deletion!"});
      }
      else{
        res.send({message: "Image not found!"})
      }
    
    });
},

addImage(req, res){
  const iid = req.body.iid
  const url = req.body.url
  const sqlInsert = 
  "INSERT INTO imagetable (iid, url) VALUES (?,?);"
  db.query(sqlInsert, [iid, url], (err, result) => {
     if (result != ""){
      return res.json({message: "Successfully added image!"});
    }    
  });
  
},
sendVehicle(req, res){
  const email = req.body.email
  const message = req.body.message
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Capitol Car Cleaners - Your Vehicle Is Ready!',
    text: message
  };
  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    return res.send("Error sending email!");
  } else {
    return res.send('Email sent to: ' + info.accepted);
  }
  });
},
};
module.exports = adminController;