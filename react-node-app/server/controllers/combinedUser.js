const  db  = require('../db.js')
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
            return res.json({message: "Wrong username/password combination!"})
          }
        }) 
      } else{
          return res.json({message: "User doesn't exist!"})
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
}
};

module.exports = combinedUserController; 