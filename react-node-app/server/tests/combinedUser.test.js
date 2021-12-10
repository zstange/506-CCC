var supertest = require('supertest');
var module = require('../index.js');
const { bcrypt, saltRounds} = require('../hash.js');
const app = module.app;
module.db.end();
module.db = require('../testdb.js');
var tables = require ('../dbTables.js');
var sqlApptTable = tables.sqlApptTable;
var sqlImgTable = tables.sqlImgTable;
var sqlInvTable = tables.sqlInvTable;
var sqlMsgTable = tables.sqlMsgTable;
var sqlPromoTable = tables.sqlPromoTable;
var sqlTestiTable = tables.sqlTestiTable;
var sqlUserTable = tables.sqlUserTable;
var sqlVhlTable = tables.sqlVhlTable;
const tableDeletion = ["appointmentTable","vehicleTable","messageTable","promotionTable","imageTable","inventoryTable","testimonialTable","userTable"];
const tableCreation = [sqlApptTable,sqlImgTable,sqlInvTable,sqlMsgTable,sqlPromoTable,sqlTestiTable,sqlUserTable,sqlVhlTable];
const { server } = require('../server.js');
const combinedUserController = require('../controllers/combinedUser.js');
const { table } = require('console');
var request = supertest(app);
const { verifyJWT } = require('../jwt.js');
jest.setTimeout(30000);

function createTable(sql){
  return new Promise( ( resolve, reject ) => {
  module.db.query(sql, (err, result) => {
    if(err){
     var retVal = err.code + "," + err.sqlMessage;
     resolve(retVal);
    }
    else if (result != ""){
      var retVal2 = "create table works";
      resolve(retVal2);
        } else{
          reject(result);
        }
    });
  });
  }

function clean(table){   
  sqlDrop = "DELETE FROM " + table;
  return new Promise( ( resolve, reject ) => {
  module.db.query(sqlDrop, (err, result) => {
    if(err){
    var err = err.code + "," + err.sqlMessage;
    reject(err);
    }
    else if (result != ""){
       var message = "delete works";
       resolve(message);
        } else{
        console.log(result);
        }
      });
  });
  };
  
async function hashPwd(){
    sqlInsert = "INSERT INTO usertable (uid,firstName,lastName,email,password,phoneNumber,role,recievePromotions) VALUES (?,?,?,?,?,?,?,?);";
    password = 'pwd';
    const hash = await bcrypt.hash(password,saltRounds);
    var res = await userInsert(sqlInsert,hash)
    return res;
};

function userInsert(sql,password){
    const u1 = [195,"P","M",'fake1',password,'000-000-0000','user','false'];
    return new Promise( ( resolve, reject ) => {
        module.db.query(sql,u1,(err, result) => {
              if(err){
                reject(err);
              }
              else if (result != ""){
                  var message = {message: "insert worked"};
                  resolve(message);
              }              
        });
    });
};

function vhlInsert(){
  const sql = "INSERT INTO vehicletable (vid, uid, make, model, year, color, licensePlate, additionalInfo) VALUES (?,?,?,?,?,?,?,?);"
  const v1 = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
  return new Promise( ( resolve, reject ) => {
      module.db.query(sql,v1,(err, result) => {
            if(err){
              reject(err);
            }
            else if (result != ""){
                var message = {message: "insert worked"};
                resolve(message);
            }              
      });
  });
};

function apptInsert(){
  const sql = "INSERT INTO appointmenttable (aid, uid, vid,dateTime,service,additionalInfo,status) VALUES (?,?,?,?,?,?,?);"
  const a1 = [1,195,1,0,"service","none","pending"];
  return new Promise( ( resolve, reject ) => {
      module.db.query(sql,a1,(err, result) => {
            if(err){
              reject(err);
            }
            else if (result != ""){
                var message = {message: "insert worked"};
                resolve(message);
            }              
      });
  });
};

beforeAll(async() => {
  for(let i = 0; i < 8; i++){
    await createTable(tableCreation[i]);
  }
});

beforeEach(async() => {
  for(let i = 0; i < 8; i++){
    await clean(tableDeletion[i]);
  }
});

afterEach(function(){
  server.close();
});

afterAll(function() {
  module.db.end();
});

test('get /', async() => {
      const response = await request.get('/');
      const expected = { message: "Hello from server!" }  
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(expected);
});


test('get /login with no info', async () => {
  const response = await request.post('/login');
  const expected = {message: "User doesn't exist!"};
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('get /login with wrong info for password', async () => {
  var res = await hashPwd();
  console.log(res);
  const expected = {message: "Wrong username/password combination!"}; 
  const response = await request.post('/login').send({ 
  email: 'fake1', 
  password: 'wrong'
   });
   expect(response.body).toStrictEqual(expected);
   expect(response.status).toBe(200);
});

test('get /login with correct info', async() => {
  var res = await hashPwd();
  console.log(res);
  const expected = { userID: 195, role: 'user' }; 
  const response =  await request.post('/login').send({ 
  email: 'fake1', 
  password: 'pwd'
  });
  console.log(response.body);
  expect(response.body.userInfo).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('get /addAppointment with correct info', async() => {
  await hashPwd();
  await vhlInsert();
  await apptInsert();
  const expected = {err: "db query error"}; 
  /*
  const req = {body:{uid:195,vid:1}};
  const res = "";
  const response = combinedUserController.addAppointment(req,res);
  console.log(response.body);
  */
  const response =  await request.post('/addAppointment');
  console.log(response.body);
  expect(response.body.userInfo).toStrictEqual(expected);
  expect(response.status).toBe(200);
});
