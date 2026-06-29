const jwt=require("jsonwebtoken");

function setUser(user){ //maybe called at sign in or login 
    return jwt.sign(
    {
        _id:user._id,
        email:user.email,   
    } ,
    process.env.JWT_SECRET,
    {expiresIn:"7d"}
); //passing 2 args in function of sign

}

function getUser(token){
    if(!token) return null;

    try{
        return jwt.verify(token,process.env.JWT_SECRET);
    }
    catch(err){
        return null;
    }
}
module.exports={
    setUser,
    getUser,
}