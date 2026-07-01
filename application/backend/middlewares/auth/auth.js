const { getUser } = require("../../services/auth");

function checkForAuthentication(req, res, next) {
  const authorizationHeaderValue = req.headers["authorization"];

  const token =req.cookies.uid;
  req.user=null;

  if(!token)
  {
    return next();
  }

  const user=getUser(token);
  req.user=user;
  return next();

  
}

module.exports = {
  checkForAuthentication,
};

















//restrictToLoggedinUserOnly
//checkAuth

 /*
 Read token from cookie
Verify token using getUser(token)
Put user data in req.user
Allow or redirect
 */










//check if user is logged in before allowing protected pages.

