
const mongoose = require('mongoose');
const passportLocalMongoose=require("passport-local-mongoose")

const userScheama= mongoose.Schema({

   
    email:{
        type:String,
        required:true
    }
})

userScheama.plugin(passportLocalMongoose); //automacticallay create username and password field with hashing password

const User=mongoose.model('User',userScheama);
module.exports=User;