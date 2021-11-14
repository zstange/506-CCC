// server/index.js

const customerController = require('./controllers/customer')
const combinedUserController = require('./controllers/combinedUser')
const { app } = require('./server.js')

app.get("/", combinedUserController.home)
app.post("/login", combinedUserController.login)
app.post("/createAccount", customerController.createAcc)
app.post("/addAppointment", customerController.addAppointment)
app.post("/forgotPassword", customerController.forgotPassword)
app.post("/checkEmail", customerController.checkEmail)
app.get("/getAppointments", customerController.getAppointments)
app.post("/getVehicles", customerController.getVehicles)
app.post("/editAppointment", customerController.editAppointment)
app.post("/addVehicle", customerController.addVehicle)
app.post("/deleteAppointment", customerController.deleteAppointment)
app.post("/deleteVehicle", customerController.deleteVehicle)
app.get("/getUser", customerController.getUser)
app.post("/getUserAppointments", customerController.getUserAppointments)
app.post("/getAppointmentsByDate", customerController.getAppointmentsByDate)
module.exports = {app}