const { validateToken }  = require("../services/authentication.js");

function checkForAuthenticationCookie(cookieName) {
    return async (req, res, next) => {
        const tokenCookieValue = await req.cookies[cookieName]

        if(tokenCookieValue === undefined){
            return next();
        }

        try{
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        }
        catch(error) {}

        return next();
    }   
}

module.exports = {checkForAuthenticationCookie,}