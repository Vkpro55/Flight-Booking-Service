const express = require("express");
const apiRoutes = require("./routes");

const { ServerConfig } = require("./config");
const CRON = require('./utils/common/cron-jobs');

const app = express();

/*=== Register your body-parse middleware for all requests 
- Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
===*/
app.use(express.json());

/*== 
The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).

querystring library: cannot parsed nested object.
qs library: can be parsed in nested object.
==*/
app.use(express.urlencoded({ extended: true }));

/*=== Routes ===*/
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    CRON();
})  
