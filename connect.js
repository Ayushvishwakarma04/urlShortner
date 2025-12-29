import mongoose from "mongoose";

async function connecttomongodb(url) {
  return mongoose.connect(url);
}

export{connecttomongodb}