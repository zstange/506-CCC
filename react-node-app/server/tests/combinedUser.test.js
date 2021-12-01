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
const tableCreation = [sqlApptTable,sqlImgTable,sqlInvTable,sqlMsgTable,sqlPromoTable,sqlTestiTable,sqlUserTable,sqlVhlTable];
const { server } = require('../server.js');
const combinedUserController = require('../controllers/combinedUser.js');
var request = supertest(app);
jest.setTimeout(15000);

async function createTable(){
await module.db.query(sqlUserTable, (err, result) => {
    if(err){
      console.log(err.code + "," + err.sqlMessage);
    }
    else if (result != ""){
      console.log("create table works");
        } else{
       console.log(result);
        }
    });

  }

async function clean(){   
  sqlDrop = "DELETE FROM usertable;";
   await module.db.query(sqlDrop, (err, result) => {
    if(err){
    console.log(err.code + "," + err.sqlMessage);
    }
    else if (result != ""){
       return console.log("delete works");
        } else{
        console.log(result);
        }
      });
    };
  
 function hashPwd(){
    sqlInsert = "INSERT INTO usertable (uid,firstName,lastName,email,password,phoneNumber,role,recievePromotions) VALUES (?,?,?,?,?,?,?,?);";
    password = 'pwd';
    bcrypt.hash(password,saltRounds, (err, hash) =>{
      if(err){
        console.log({err: "cannot hash password"});
      }    
      const result = userInsert(sqlInsert,hash);
      console.log(result);
    });
};

async function userInsert(sql,password){
  
     const u1 = [195,"P","M",'fake1',password,'000-000-0000','user','false'];
      await module.db.query(sql,u1,(err, result) => {
              if(err){
               console.log(err);
              }
                else if (result != ""){
                  console.log({message: "insert worked"});
                }              
          });
      };

beforeAll(async()=>{
  await createTable();
  await clean();
});

beforeEach(function(){
  hashPwd();
});

afterEach(function(){
  server.close();
});

afterAll(function() {
  module.db.end();
});


test('get /login with correct info', async() => {
              const expected = { userID: 195, role: 'user' }; 
              const response =  await request.post('/login').send({ 
              email: 'fake1', 
              password: 'pwd'
              });
              console.log(response.body);
              expect(response.body.userInfo).toStrictEqual(expected);
              expect(response.status).toBe(200);
      });
/*
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
  const expected = {message: "Wrong username/password combination!"}; 
  const response = await request.post('/login').send({ 
  email: 'fake1', 
  password: 'wrong'
   });
   expect(response.body).toStrictEqual(expected);
   expect(response.status).toBe(200);
});
*/