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
const customerController = require('../controllers/customer.js');
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


test('post /createAccount with no password', async() => {
    const expected = {err: 'cannot hash password'}; 
    const response = await request.post('/createAccount');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });
  
test('post /createAccount with correct info', async () =>{
      const expected =  {message: "Created an account successfully"};
      const response = await request.post('/createAccount').send({
      firstName: 'preetham',
      lastName: 'mukkara',
      email: "fake",
      password: "pwd",
      phoneNumber: "999-999-9999",
      role: "user",
      promotions: "none"
    });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });   

  test('get /getAppointmentDates with incorrect info for query', async() => {
    const expected = {message: "cannot get appointment information"};
    const response = await request.get('/getAppointmentDates').set({authorization: "test"});
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('get /getAppointmentDates with correct info for query', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
    await vhlInsert(vehicle);
    const appt = [1,195,1,0,"service","none","pending"];
    await apptInsert(appt);
    const expected = 1;
    const response = await request.get('/getAppointmentDates').set({authorization: "test"});
    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(expected);
  });

  test('post /getUserAppointments with incorrect info for query', async() => {
    const expected = {message: "cannot get appointment information"};
    const response = await request.post('/getUserAppointments').set({authorization: "test"});
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /getUserAppointments with incorrect info for query', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
    await vhlInsert(vehicle);
    const appt = [1,195,1,0,"service","none","pending"];
    await apptInsert(appt);
    const expected = 1;
    const response = await request.post('/getUserAppointments').set({authorization: "test"}).send({
      uid: 195
    });
    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(expected);
  });

  test('post /getAppointmentsByDate with incorrect info for query', async() => {
    const expected = {data: [], length: 0};
    const response = await request.post('/getAppointmentsByDate').set({authorization: "test"});
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /getAppointmentsByDate with correct info for query', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
    await vhlInsert(vehicle);
    const appt = [1,195,1,0,"service","none","pending"];
    await apptInsert(appt);
    const expected = 1;
    const response = await request.post('/getAppointmentsByDate').set({authorization: "test"}).send({
      dateTime: '0000-00-00 00:00:00'
    });
    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(expected);
  });

  test('post /getVehicles with incorrect info for query', async() => {
    const expected = {message: "cannot get vehicle information"};
    const response = await request.post('/getVehicles').set({authorization: "test"});
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /getVehicles with correct info for query', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
    await vhlInsert(vehicle);
    const expected = 1;
    const response = await request.post('/getVehicles').set({authorization: "test"}).send({
      uid: 195
    });
    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(expected);
  });

  test('post /forgotPassword with incorrect info for outer query', async() => {
    const expected = {message: "Please fill out all information required."};
    const response = await request.post('/forgotPassword');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /forgotPassword with correct info for outer query but incorrect for inner query', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const expected = {err: "cannot hash password"};
    const response = await request.post('/forgotPassword').send({
      email: 'fake1'
    });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /forgotPassword with correct info for outer query and inner query', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const expected = {message: "Updated password successfully"};
    const response = await request.post('/forgotPassword').send({
      email: 'fake1',
      password: 'newPwd'
    });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /checkEmail with incorrect info for query', async() => {
    const expected = {value: false};
    const response = await request.post('/checkEmail');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /checkEmail with correct info for query', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const expected = {value: true};
    const response = await request.post('/checkEmail').send({
      email: 'fake1'
    });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /addVehicle with incorrect info for query', async() => {
    const expected = {err: "db query error"};
    const response = await request.post('/addVehicle').set({authorization: "test"}).send({
      uid: 0
    });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /addVehicle with correct info for query', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const expected = {message: "Vehicle added successfully"};
    const response = await request.post('/addVehicle').set({authorization: "test"}).send({
      uid: 195
    });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /deleteVehicle with incorrect info for query', async() => {
    const expected = {message: "Vehicle is not found!"};
    const response = await request.post('/deleteVehicle').set({authorization: "test"});
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /deleteVehicle with correct info for query', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const vehicle = [1,195,"Honda","Accord",2012,"Black","LOLOLOL","None"];
    await vhlInsert(vehicle);
    const expected = {message: "Vehicle deleted successfully"};
    const response = await request.post('/deleteVehicle').set({authorization: "test"}).send({
      vid: 1
    });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /getUser with incorrect info for query', async() => {
    const expected = {message: "cannot get user information"};
    const response = await request.post('/getUser').set({authorization: "test"});
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expected);
  });

  test('post /getUser with correct info for query', async() => {
    const user = [195,"P","M",'fake1','pwd','000-000-0000','user','false'];
    await hashPwd(user);
    const expected = 1;
    const response = await request.post('/getUser').set({authorization: "test"}).send({
      uid: 195
    });
    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(expected);
  });

test('post /resetPassword with incorrect info for query', async() => {
  const expected = "Error sending email!";
  const response = await request.post('/resetPassword');
  expect(response.status).toBe(200);
  expect(response.text).toStrictEqual(expected);
});

test('post /resetPassword with correct info for query', async() => {
  const user = [195,"P","M",'theangryone666@gmail.com','pwd','000-000-0000','user','false'];
  await hashPwd(user);
  const response = await request.post('/resetPassword').send({
    email: 'theangryone666@gmail.com'
    });
  const expected = "Email sent to: theangryone666@gmail.com";
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(expected);
});