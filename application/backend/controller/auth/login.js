const User=require('../../models/user')
const {setUser}=require('../../services/auth')
const bcrypt = require("bcrypt")

async function handleUserLogin(req,res) {
    const {email, password}=req.body;

    const user=await User.findOne({email});

    if(!user){
        return res.status(401).json({ // Return JSON instead of rendering a page
            error: "invalid username or password"
        });
    }
    const isMatch = await bcrypt.compare(password, user.password); // Compare entered password with hashed password

    if (!isMatch) {
        return res.status(401).json({ // Return JSON if password is incorrect, hashes plain password agin using same salt for comparision
            error: "invalid username or password"
        });
    }

    const token=setUser(user);
    res.cookie("uid", token, {
    httpOnly: true, //doubt
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", //Don't hand my login pass to random websites.
    path: "/", //My login pass is valid for every page on my website
    });

    return res.status(200).json({
        message: "login successful",
        token,
        user: {
            _id: user._id,
            email: user.email,
            FirstName: user.FirstName,
            LastName: user.LastName,
        },
    });
}

module.exports={
    handleUserLogin
}