const mongoose = require("mongoose");

const connectToMongoDb = (url) => {
    mongoose.connect(url)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log("Error connecting to DB ",err))
};

module.exports = {connectToMongoDb};
