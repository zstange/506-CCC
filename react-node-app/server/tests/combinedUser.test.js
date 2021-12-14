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
var request = supertest(app);
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
  
async function hashPwd(user){
    sqlInsert = "INSERT INTO usertable (uid,firstName,lastName,email,password,phoneNumber,role,recievePromotions) VALUES (?,?,?,?,?,?,?,?);";
    password = 'pwd';
    const hash = await bcrypt.hash(user[4],saltRounds);
    user[4] = hash;
    var res = await userInsert(user,sqlInsert);
    return res;
};

function userInsert(user,sql){
    return new Promise( ( resolve, reject ) => {
        module.db.query(sql,user,(err, result) => {
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

function vhlInsert(vehicle){
  const sql = "INSERT INTO vehicletable (vid, uid, make, model, year, color, licensePlate, additionalInfo) VALUES (?,?,?,?,?,?,?,?);"
  const v1 = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
  return new Promise( ( resolve, reject ) => {
      module.db.query(sql,vehicle,(err, result) => {
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

function apptInsert(appt){
  const sql = "INSERT INTO appointmenttable (aid, uid, vid,dateTime,service,additionalInfo,status) VALUES (?,?,?,?,?,?,?);"
  return new Promise( ( resolve, reject ) => {
      module.db.query(sql,appt,(err, result) => {
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

function inventoryInsert(inventory){
  const sql = "INSERT INTO inventoryTable (iid,price,make,model,year,color,additionalInfo) VALUES (?,?,?,?,?,?,?);"
  return new Promise( ( resolve, reject ) => {
      module.db.query(sql,inventory,(err, result) => {
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

function imageInsert(img){
  const sql = "INSERT INTO imageTable(imageid,iid,url) VALUES (?,?,?);"
  return new Promise( ( resolve, reject ) => {
      module.db.query(sql,img,(err, result) => {
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

function promotionInsert(promo){
  const sql = "INSERT INTO promotionTable (pid,promotionName,message) VALUES (?,?,?);"
  return new Promise( ( resolve, reject ) => {
      module.db.query(sql,promo,(err, result) => {
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

test('post /login with no info', async () => {
  const response = await request.post('/login');
  const expected = {message: "User doesn't exist!"};
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /login with wrong info for password', async () => {
  const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
  await hashPwd(user);
  const expected = {message: "Wrong username/password combination!"}; 
  const response = await request.post('/login').send({ 
  email: 'fake1', 
  password: 'wrong'
   });
   expect(response.body).toStrictEqual(expected);
   expect(response.status).toBe(200);
});

test('post /login with correct info', async() => {
  const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
  await hashPwd(user);
  const expected = { userID: 195, role: 'user' }; 
  const response =  await request.post('/login').send({ 
  email: 'fake1', 
  password: 'pwd'
  });
  expect(response.body.userInfo).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('post /addAppointment with wrong info', async() => {
  const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
  await hashPwd(user);
  const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
  await vhlInsert(vehicle);
  const appt = [1,195,1,0,"service","none","pending"];
  await apptInsert(appt);
  const expected = {err: "db query error"}; 
  const response =  await request.post('/addAppointment').set({authorization: "test"}).send(
            {
                uid: 195,
                vid: 23
            });
  expect(response.body).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('post /addAppointment with correct info', async() => {
  const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
  await hashPwd(user);
  const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
  await vhlInsert(vehicle);
  const appt = [1,195,1,0,"service","none","pending"];
  await apptInsert(appt);
  const expected = {message: "Appointment added successfully"}; 
  const response =  await request.post('/addAppointment').set({authorization: "test"}).send(
            {
                uid: 195,
                vid: 1
            });
  expect(response.body).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('post /editAppointment with non existent appointment', async() => {
  const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
  await hashPwd(user);
  const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
  await vhlInsert(vehicle);
  const appt = [1,195,1,0,"service","none","pending"];
  await apptInsert(appt);
  const expected = {message: "appointment doesn't exist in the table."}; 
  const response =  await request.post('/editAppointment').set({authorization: "test"}).send(
            {
                aid: 2
            });
  expect(response.body).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('post /editAppointment with existing appointment', async() => {
  const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
  await hashPwd(user);
  const vehicle1 = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
  const vehicle2 = [2,195,"Honda","Civic",2000,"Grey","YESSSIR","None"];
  await vhlInsert(vehicle1);
  await vhlInsert(vehicle2);
  const appt = [1,195,1,0,"service","none","pending"];
  await apptInsert(appt);
  const expected = {message: "Appointment edited successfully"}; 
  const response =  await request.post('/editAppointment').set({authorization: "test"}).send(
            {
                aid: 1,
                vid: 2
            });
  expect(response.body).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('post /deleteAppointment with non-existent appointment', async() => {
  const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
  await hashPwd(user);
  const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
  await vhlInsert(vehicle);
  const appt = [1,195,1,0,"service","none","pending"];
  await apptInsert(appt);
  const expected = {message: "Appointement is not found!"}; 
  const response =  await request.post('/deleteAppointment').set({authorization: "test"}).send(
            {
                aid: 2,
            });
  expect(response.body).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('post /deleteAppointment with existing appointment', async() => {
  const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
  await hashPwd(user);
  const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
  await vhlInsert(vehicle);
  const appt = [1,195,1,0,"service","none","pending"];
  await apptInsert(appt);
  const expected = {message: "Appointment deleted successfully"}; 
  const response =  await request.post('/deleteAppointment').set({authorization: "test"}).send(
            {
                aid: 1,
            });
  expect(response.body).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('post /getImages with no images', async() => {
  const expected = {message: "cannot fetch inventory"}; 
  const response =  await request.post('/getImages')
  expect(response.body).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('post /getImages with images', async() => {
  const inventory = [666,4,"Honda","Accord",2012,"Black","None"];
  await inventoryInsert(inventory);
  const img = [333,666,"lol.com"];
  await imageInsert(img);
  const expectedLength = 1; 
  const expected = 333;
  const response =  await request.post('/getImages')
  expect(response.body.length).toStrictEqual(expectedLength);
  expect(response.body.data[0].imageid).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('get /getInventory with no inventory', async() => {
  const expected = {message: "cannot fetch inventory"}; 
  const response =  await request.get('/getInventory')
  expect(response.body).toStrictEqual(expected); 
  expect(response.status).toBe(200);
});


test('get /getInventory with no inventory', async() => {
  const inventory = [666,4,"Honda","Accord",2012,"Black","None"];
  await inventoryInsert(inventory);
  const response =  await request.get('/getInventory')
  const expectedLength = 1; 
  const expected = 666;
  expect(response.body.length).toStrictEqual(expectedLength);
  expect(response.body.data[0].iid).toStrictEqual(expected);
  expect(response.status).toBe(200);
});

test('get /getPromotions with no promotions', async() => {
  const expected = {message: "cannot fetch promotions"}; 
  const response =  await request.get('/getPromotions')
  expect(response.body).toStrictEqual(expected); 
  expect(response.status).toBe(200);
});

test('get /getInventory with no inventory', async() => {
  const promo = [999,"FakeLOL","This promotion is fake."];
  await promotionInsert(promo);
  const response =  await request.get('/getPromotions')
  const expectedLength = 1; 
  const expected = 999;
  expect(response.body.length).toStrictEqual(expectedLength);
  expect(response.body.data[0].pid).toStrictEqual(expected);
  expect(response.status).toBe(200);
});
