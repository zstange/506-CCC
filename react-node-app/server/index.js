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
app.post("/addAppointment", combinedUserController.addAppointment)
app.post("/editAppointment", combinedUserController.editAppointment)
app.post("/deleteAppointment", combinedUserController.deleteAppointment)
app.post("/getImages", combinedUserController.getImages)

//customer api calls
app.post("/createAccount", customerController.createAcc)
app.post("/forgotPassword", customerController.forgotPassword)
app.post("/checkEmail", customerController.checkEmail)
app.post("/getVehicles", customerController.getVehicles)
app.post("/addVehicle", customerController.addVehicle)
app.post("/deleteVehicle", customerController.deleteVehicle)
app.post("/getUser", customerController.getUser)
app.post("/getUserAppointments", customerController.getUserAppointments)
app.get("/getAppointmentDates", customerController.getAppointmentDates)
app.post("/getAppointmentsByDate", customerController.getAppointmentsByDate)

//admin api calls
app.get("/getUsers", adminController.getUsers)
app.post("/getAppointmentByAppId", adminController.getAppointmentByAppId)
app.get("/getAppointmentsAdmin", verifyJWT, adminController.getAppointments)
app.post("/addInventory", adminController.addInventory)
app.post("/editInventory", adminController.editInventory)
app.post("/deleteInventory", adminController.deleteInventory)
app.post("/deleteImages", adminController.deleteImages)
app.post("/addImage", adminController.addImage)
app.get("/getInventory", adminController.getInventory)
app.post("/addPromotion", adminController.addPromotion)
app.post("/deletePromotion", adminController.deletePromotion)
exports.app = app;
exports.db = db;

