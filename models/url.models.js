import mongoose from "mongoose";

const urlSchema = mongoose.Schema({
  shortId: {
    type: String,
    unique: true,
    required: true
  },
  redirectURL: {
    type: String,
    required: true
  },
  visitHistory: [{
    timestamp: { type: Number },
    ip: { type: String },
    userAgent: { type: String }
  }]
}, { timestamps: true })

export const URL = mongoose.model("urls", urlSchema);