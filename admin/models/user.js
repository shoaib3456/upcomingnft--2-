const mongoose = require('mongoose')
const validator  = require('validator')

let date =  new Date().toUTCString();
const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        minlength:3,
        maxlength:100
    },
    email : {
        type:String,
        required:true,
        unique:[true,"Email is already exist"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Invaid Email")
            }
        }
    },
    password : {
        type:String,
        required:true,
        minlength:5,
        maxlength:100
    },
    approved : {
        type:Number,
        default: 1
    },
    createdAt:{
        type:Date,
        default: date
    },
})


const User  = new mongoose.model('user',userSchema);
module.exports = User;
