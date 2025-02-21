
const userRouter = require("./routes/users.js");
const { connectToMongoDb } = require("./config/connection.js");

function setupBackend(app) {

    connectToMongoDb("mongodb://localhost:27017/CodeCollab");

    app.use("/user", userRouter);
}

module.exports = {setupBackend,};
