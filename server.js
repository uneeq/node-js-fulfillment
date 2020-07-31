const express = require("express");
const bodyParser = require("body-parser");
const { dialogflowFirebaseFulfillment } = require("./fulfillment")
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    dialogflowFirebaseFulfillment(req, res);
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.listen(3000, ()=>{
    console.log(`Server listening on port 3000`);
});
