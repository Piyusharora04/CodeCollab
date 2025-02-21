const JWT = require("jsonwebtoken");

const  secret = "Code@Collab$44";

function createToken(user){
    const payload = {
        _id:user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
    };

    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token ,secret);
    return payload;
}

module.exports = {
    createToken,
    validateToken,
}

