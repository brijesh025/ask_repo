const User=require('../../models/user')
const {setUser}=require('../../services/auth')

async function handleUserSignUp(req,res) {
    
    const{FirstName,LastName,email,password}=req.body;
    const isAvail=await User.find({email})

    if(isAvail>0)
    {
        return res.json("email already exists");
    }
    const user=await User.create({
        FirstName,
        LastName,
        email,
        password
    }); //creating record in database

    const token = setUser(user);
    res.cookie("uid",token,{path:"/"}) // '/' is always fixed
    return res.redirect("/") 
}

module.exports={
    handleUserSignUp
}
