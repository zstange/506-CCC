const sqlUserTable = "CREATE TABLE userTable( uid INT NOT NULL AUTO_INCREMENT, firstName VARCHAR(45) NULL, lastName VARCHAR(45) NULL, email VARCHAR(45) NULL, password VARCHAR(500) NULL, phoneNumber VARCHAR(10) NULL, role VARCHAR(45) NULL, recievePromotions BOOLEAN NULL,PRIMARY KEY (`uid`))";
const sqlApptTable = "CREATE TABLE appointmentTable( aid INT NOT NULL AUTO_INCREMENT,uid INT NULL,vid INT NULL,dateTime DATETIME NULL,service VARCHAR(45) NULL,additionalInfo VARCHAR(1000) NULL,status VARCHAR(45) NULL,PRIMARY KEY (`aid`),FOREIGN KEY (`uid`) REFERENCES userTable(`uid`),FOREIGN KEY (`vid`) REFERENCES vehicleTable(`vid`))";;
const sqlVhlTable =   "CREATE TABLE vehicleTable(vid INT NOT NULL AUTO_INCREMENT, uid INT NULL, make VARCHAR(45) NULL, model VARCHAR(45) NULL,year INT NULL,color VARCHAR(15) NULL,licensePlate VARCHAR(10) NULL,additionalInfo VARCHAR(1000) NULL,PRIMARY KEY (`vid`),FOREIGN KEY (`uid`) REFERENCES userTable(`uid`))";
const sqlInvTable = "CREATE TABLE inventoryTable (iid INT NOT NULL AUTO_INCREMENT,price FLOAT NULL,make VARCHAR(45) NULL,model VARCHAR(45) NULL,year INT NULL,color VARCHAR(45) NULL,additionalInfo VARCHAR(1000) NULL,PRIMARY KEY (`iid`))";
const sqlImgTable = "CREATE TABLE imageTable(imageid INT NOT NULL AUTO_INCREMENT,iid INT NULL,url VARCHAR(200) NULL,PRIMARY KEY (`imageid`),FOREIGN KEY (`iid`) REFERENCES inventoryTable(`iid`))";
const sqlPromoTable = "CREATE TABLE promotionTable (pid INT NOT NULL AUTO_INCREMENT,promotionName VARCHAR(45) NULL,message VARCHAR(1000) NULL,PRIMARY KEY (`pid`))";
const sqlTestiTable =  "CREATE TABLE testimonialTable(tid INT NOT NULL AUTO_INCREMENT,author VARCHAR(45) NULL,message VARCHAR(10000) NULL,PRIMARY KEY (`tid`))";
const sqlMsgTable =  "CREATE TABLE messageTable(mid INT NOT NULL AUTO_INCREMENT,uidSender INT NULL,uidReciever INT NULL,dateTime DATETIME NULL,message VARCHAR(1000) NULL,PRIMARY KEY (`mid`),FOREIGN KEY (`uidSender`) REFERENCES userTable(`uid`),FOREIGN KEY (`uidReciever`) REFERENCES userTable(`uid`))";

exports.sqlUserTable = sqlUserTable;
exports.sqlApptTable = sqlApptTable;
exports.sqlVhlTable = sqlVhlTable;
exports.sqlInvTable = sqlInvTable;
exports.sqlImgTable = sqlImgTable;
exports.sqlPromoTable = sqlPromoTable;
exports.sqlTestiTable = sqlTestiTable;
exports.sqlMsgTable = sqlMsgTable;