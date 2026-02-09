import mongoose from "mongoose";

const urlSchema = mongoose.Schema({
  shortId: {
    type: String,
    unique: true,
    required: true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
    reuired:true
  },
  redirectURL: {
    type: String,
    required: true
  },
  visitHistory: [{
    timestamp: { type: Number },
    ip: { type: String },
    userAgent: { type: String }
  }],
  isDeleted:{
    type:Boolean,
    default:false
  },
  deletedAt:{
    type:Date,
    default:null
  }
}, { timestamps: true })

export const URL = mongoose.model("urls", urlSchema);