const mongoose = require("mongoose");
const crypto = require ("crypto");

const { createToken } = require("../services/authentication.js");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type:String,
    },
    phoneNumber : {
        type: String,
        required: true,
    },
    profileImageUrl:{
        type:String,
        default: "/Images/default.png",
    },
    password: {
        type: String,
        required: true,
    },
    joinedRooms: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"rooms",
    }
}, {timestamps: true});

userSchema.pre("save" , function (next) {
    const user = this;
    if(!user.isModified("password")) return;

    const salt = crypto.randomBytes(16).toString("hex");

    const hashedPassword = crypto.createHmac('sha512', salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({email});
    if(!user) return 0;
    
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = crypto.createHmac('sha512', salt)
    .update(password)
    .digest("hex");

    if(hashedPassword !== userProvidedHash){
        return -1;
    }

    const token = createToken(user);

    return token;
});


const User = mongoose.model("users", userSchema);

module.exports = User;