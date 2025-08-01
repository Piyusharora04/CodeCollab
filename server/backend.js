
const userRouter = require("./routes/users.js");
const { connectToMongoDb } = require("./config/connection.js");

function setupBackend(app) {

    connectToMongoDb("mongodb+srv://PiyushArora:123456789p@cluster0.ncc8dv6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    app.use("/user", userRouter);
}

module.exports = {setupBackend,};
