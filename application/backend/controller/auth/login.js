const User=require('../../models/user')
const {setUser}=require('../../services/auth')

async function handleUserLogin(req,res) {
    const {email,password}=req.body;

    const user=await User.findOne({email,password});

    if(!user){
        return res.render("login",{ //have to change 
            error:"invalid username or password"
        });
    }

    const token=setUser(user);
    res.cookie("uid", token, { path:"/"});
    return res.redirect("/");
}

module.exports={
    handleUserLogin
}