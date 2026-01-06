import { connecttomongodb } from "./connect.js";
import dotenv from "dotenv";
import {router} from "./routes/url.routes.js";
import express from "express";
import { entryfunc, getAnalytics } from "./controller/url.controller.js";
import {Router} from "./routes/auth.route.js";

dotenv.config();
const app=express();
app.use(express.json());
connecttomongodb(process.env.DB).then(()=>{
  console.log("Connected to MongoDB")
});

app.use("/url",router);
app.get("/analytics/:shortId",getAnalytics);
app.set("trust proxy",true); //deploy proxy
app.use("/",Router);
app.listen(process.env.PORT,()=>{
  console.log(`Listening on port ${process.env.PORT}`)
})
