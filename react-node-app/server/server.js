const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());


const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });


module.exports = {server, app}