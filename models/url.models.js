import mongoose from "mongoose";

const urlSchema = mongoose.Schema({
  shortId:{
    type:String,
    unique:true,
    required:true
  },
  redirectURL:{
    type:String,
    required:true
  },
  visitHistory:[{timestamp: {type:Number}}]
},{timestamps:true})

export const URL = mongoose.model("urls",urlSchema);