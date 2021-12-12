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
const adminController = require('../controllers/admin.js');
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
              resolve(err);
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

test('get /getAppointmentsAdmin with incorrect info', async() => {
      const response = await request.get('/getAppointmentsAdmin').set({authorization: "test"});
      const expected = {message: "cannot get appointment information"}  
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(expected);
});

test('get /getAppointmentsAdmin with correct info', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
    await vhlInsert(vehicle);
    const appt = [1,195,1,0,"service","none","pending"];
    await apptInsert(appt);
    const response = await request.get('/getAppointmentsAdmin').set({authorization: "test"});
    const expected = 1;
    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(expected);
});

test('get /getAppointmentByAppId with incorrect info', async() => {
    const response = await request.post('/getAppointmentByAppId').set({authorization: "test"});
    const expected = {message: "cannot get appointment information"}  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
});

test('get /getAppointmentByAppId with incorrect info', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
    await vhlInsert(vehicle);
    const appt = [1,195,1,0,"service","none","pending"];
    await apptInsert(appt);
    const response = await request.post('/getAppointmentByAppId').set({authorization: "test"}).send({
        aid: 1
    });
    const expected = 1;
    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(expected);
});

test('get /getUsers with incorrect info', async() => {
    const response = await request.get('/getUsers').set({authorization: "test"});
    const expected = {message: "cannot get user information"}  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
});

test('get /getUsers with correct info', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const response = await request.get('/getUsers').set({authorization: "test"});
    const expected = 1 
    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(expected);
});

test('post /addInventory with correct info', async() => {
  const response = await request.post('/addInventory').set({authorization: "test"});
  const expected = {message: "Added a vehicle to inventory successfully"}  
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /editInventory with incorrect info', async() => {
  const response = await request.post('/editInventory').set({authorization: "test"}).send({
    iid: 222222
  });
  const expected = {message: "Vechicle does not exist in inventory!"}  
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /editInventory with correct info', async() => {
  const inventory = [666,4,"Honda","Accord",2012,"Black","None"];
  await inventoryInsert(inventory);
  const response = await request.post('/editInventory').set({authorization: "test"}).send({
    iid: 666
  });
  const expected = {message: "Edited a vehicle in the inventory successfully"}  
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /deleteInventory with incorrect info', async() => {
  const response = await request.post('/deleteInventory').set({authorization: "test"}).send({
    iid: 222222
  });
  const expected = {message: "Vehicle is not found in inventory!"}  
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /deleteInventory with correct info', async() => {
  const inventory = [666,4,"Honda","Accord",2012,"Black","None"];
  await inventoryInsert(inventory);
  const response = await request.post('/deleteInventory').set({authorization: "test"}).send({
    iid: 666
  });
  const expected = {message: "Deleted a vehicle in the inventory successfully"} 
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /addPromotion with correct info', async() => {
  const response = await request.post('/addPromotion').set({authorization: "test"});
  const expected = {message: "Added a vehicle to inventory successfully"}; 
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /deletePromotion with incorrect info', async() => {
  const response = await request.post('/deletePromotion').set({authorization: "test"}).send({
    pid: 222222
  });
  const expected = {message: "Promotion is not found in Inventory!"}  
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /deletePromotion with correct info', async() => {
  const promo = [999,"FakeLOL","This promotion is fake."];
  await promotionInsert(promo);
  const response = await request.post('/deletePromotion').set({authorization: "test"}).send({
    pid: 999
  });
  const expected = {message: "Successful deletion!"}  
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /addImage with correct info', async() => {
  const response = await request.post('/addImage').set({authorization: "test"});
  const expected = {message: "Successfully added image!"}; 
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /deleteImages with incorrect info', async() => {
  const response = await request.post('/deleteImages').set({authorization: "test"}).send({
    iid: 222222
  });
  const expected = {message: "Image not found!"}  
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});

test('post /deleteImages with correct info', async() => {
  const inventory = [666,4,"Honda","Accord",2012,"Black","None"];
  await inventoryInsert(inventory);
  const img = [333,666,"lol.com"];
  await imageInsert(img);
  const response = await request.post('/deleteImages').set({authorization: "test"}).send({
    iid: 666
  });
  const expected = {message: "Successful deletion!"} 
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});
