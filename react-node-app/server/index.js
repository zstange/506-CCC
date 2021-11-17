// server/index.js

const customerController = require('./controllers/customer')
const adminController = require('./controllers/admin')
const combinedUserController = require('./controllers/combinedUser')
const { app } = require('./server.js')
const { verifyJWT } = require('./jwt.js')

//customer api calls
app.get("/", combinedUserController.home)
app.post("/login", combinedUserController.login)
app.post("/createAccount", customerController.createAcc)
app.post("/addAppointment", combinedUserController.addAppointment)
app.post("/forgotPassword", customerController.forgotPassword)
app.post("/checkEmail", customerController.checkEmail)
app.get("/getAppointments", verifyJWT, customerController.getAppointments)
app.post("/getVehicles", customerController.getVehicles)
app.post("/editAppointment", customerController.editAppointment)
app.post("/addVehicle", customerController.addVehicle)
app.post("/deleteAppointment", customerController.deleteAppointment)
app.post("/deleteVehicle", customerController.deleteVehicle)
app.post("/getUser", customerController.getUser)
app.get("/getUsers", customerController.getUsers)
app.get("/getAppointmentDates", customerController.getAppointmentDates)
app.post("/getUserAppointments", customerController.getUserAppointments)
app.post("/getAppointmentsByDate", customerController.getAppointmentsByDate)
app.post("/getAppointmentByAppId", customerController.getAppointmentByAppId)
app.get("/getAppointmentsAdmin", verifyJWT, adminController.getAppointments)
module.exports = {app}