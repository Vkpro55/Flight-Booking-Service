const express = require("express");

const { ServerConfig, QueueConfig } = require("./config");
const apiRoutes = require("./routes");
const CRON = require('./utils/common/cron-jobs');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    CRON();

    await QueueConfig.connectQueue();
    console.log("queue connected");
})  
