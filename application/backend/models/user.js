const mongoose=require("mongoose");

const userSchema=mongoose.Schema({

    FirtsName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
}

)

const User=mongoose.model("User",userSchema);
module.exports=User;