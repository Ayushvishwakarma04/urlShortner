import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import bcrypt from "bcrypt";

async function signup(req,res) {
  const {email,password}=req.body;
  if (!email || !password){
    return res.status(400).json({message:"Email and password are required"});
  }
  const existing = await User.find({
    email
  })
  if (!existing){
    return res.status(409).json({message:"User already exists"});
  }
  const hashPass = await bcrypt.hash(password,10);
  console.log(hashPass);
  const user = await User.create({
    email,
    password:hashPass
  })
  const token=(
    {userId:user._id},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
  )
  return res.status(200).json(token)
}

async function login(req,res){
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if (!user){
    return res.status(401).json({message:"Invalid Credentials"});
  }
  const match=bcrypt.compare(password,user.password);
  if (!match){
    res.status(401).json({message:"Invalid Credentials"});
  }
  const token = jwt.sign(
    {userId: user._id},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
  );
  return res.status(200).json({token})
}

export {signup,login}