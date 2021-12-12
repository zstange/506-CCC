// server/index.js
var db  = require('./db.js')

const customerController = require('./controllers/customer')
const adminController = require('./controllers/admin')
const combinedUserController = require('./controllers/combinedUser')
const { app } = require('./server.js')
const { verifyJWT } = require('./jwt.js')

//combined user api calls
app.get("/", combinedUserController.home)
app.post("/login", combinedUserController.login)
app.post("/addAppointment", verifyJWT, combinedUserController.addAppointment)
app.post("/editAppointment", verifyJWT, combinedUserController.editAppointment)
app.post("/deleteAppointment", verifyJWT, combinedUserController.deleteAppointment)
app.post("/getAppointmentsByInfo", verifyJWT, combinedUserController.getAppointmentsByInfo)
app.post("/getImages", combinedUserController.getImages)
app.get("/getInventory", combinedUserController.getInventory)
app.get("/getPromotions", combinedUserController.getPromotions)

//customer api calls
app.post("/createAccount", customerController.createAcc)
app.post("/forgotPassword", customerController.forgotPassword)
app.post("/checkEmail", customerController.checkEmail)
app.post("/getVehicles", verifyJWT, customerController.getVehicles)
app.post("/addVehicle", verifyJWT, customerController.addVehicle)
app.post("/deleteVehicle", verifyJWT, customerController.deleteVehicle)
app.post("/getUser", verifyJWT, customerController.getUser)
app.post("/getUserAppointments", verifyJWT, customerController.getUserAppointments)
app.get("/getAppointmentDates", verifyJWT, customerController.getAppointmentDates)
app.post("/getAppointmentsByDate", verifyJWT, customerController.getAppointmentsByDate)

//admin api calls
app.get("/getUsers", verifyJWT, adminController.getUsers)
app.post("/getAppointmentByAppId", verifyJWT, adminController.getAppointmentByAppId)
app.get("/getAppointmentsAdmin", verifyJWT, adminController.getAppointments)
app.post("/addInventory", verifyJWT, adminController.addInventory)
app.post("/editInventory", verifyJWT, adminController.editInventory)
app.post("/deleteInventory", verifyJWT, adminController.deleteInventory)
app.post("/deleteImages", verifyJWT, adminController.deleteImages)
app.post("/addImage", verifyJWT, adminController.addImage)
app.post("/addPromotion", verifyJWT, adminController.addPromotion)
app.post("/deletePromotion", verifyJWT, adminController.deletePromotion)
app.post("/editPromotion", verifyJWT, adminController.editPromotion)
app.post("/sendPromotion", adminController.sendPromotion)

exports.app = app;
exports.db = db;

