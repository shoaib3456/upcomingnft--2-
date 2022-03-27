const mongoose = require('mongoose')
const validator  = require('validator')

let date =  new Date().toUTCString();
const projectSchema = new mongoose.Schema({
    project_name : {
        type:String,
        required:true,
        minlength:3,
        unique:[true,"Project Name already Taken"]
    },
    project_id : {
        type:Number
    },
    logo : {
        type:String,
        required:true,
    },
    logo2 : {
        type:String,
        required:true,
    },
    logo3 : {
        type:String,
        required:true,
    },
    cost : {
        type:String,
        required:true,
    },
    supply : {
        type:String,
        required:true,
    },
    release_date : {
        type:String,
        default:null
    },
    release_time : {
        type:String,
        default:null
    },
    release_date_time : {
        type:String,
        default:null
    },
    type : {
        type:String,
        required:true,
    },
    description : {
        type:String,
        default:null
    },
    discord : {
        type:String,
    },
    twitter : {
        type:String,
    },
    twitter_count : {
        type:String,
    },
    discord_count : {
        type:String,
    },
    website : {
        type:String,
    },
    more_information : {
        type:String,
    },
    approved : {
        type:Number,
        default: 0
    },
    promoted : {
        type:Number,
        default: 0
    },
    created_at:{
        type:Date,
        default: date
    },
    created_by:{
        type:String,
        required:true
    },
    intrested:{
        type:Number,
        default: 0
    },
    intrestedUser:{
        type:Array,
        default: []
    },
})


const Project  = new mongoose.model('project',projectSchema);
module.exports = Project;
