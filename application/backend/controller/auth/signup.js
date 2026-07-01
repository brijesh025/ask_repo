const User=require('../../models/user')
const {setUser}=require('../../services/auth')
const bcrypt=require("bcrypt")

async function handleUserSignUp(req,res) {
    
    const{firstName,lastName,email,password}=req.body;
    const isAvail=await User.findOne({email})

    if(isAvail)
    {
        return res.status(409).json({
            error: "Email already exists",
        });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user=await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
    }); //creating record in database

    const token = setUser(user);
    res.cookie("uid", token, {
        httpOnly: true,
        path: "/",
    });

    return res.status(201).json({
        message: "Signup successful",
        token,
        user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    });
}

module.exports={
    handleUserSignUp
}
