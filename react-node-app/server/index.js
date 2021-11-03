// server/index.js

const customerController = require('./controllers/customer')
const combinedUserController = require('./controllers/combinedUser')
const { app } = require('./server.js')

app.get("/", combinedUserController.home)
app.get("/login", combinedUserController.login)
app.post("/createAccount", customerController.createAcc)
app.post("/addAppointment", customerController.addAppointment)
app.post("/forgotPassword", customerController.forgotPassword)
app.post("/checkEmail", customerController.checkEmail)
app.get("/getAppointment", customerController.getAppointment)


module.exports = {app}