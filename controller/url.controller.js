import { nanoid } from "nanoid";
import { URL as URLModel } from "../models/url.models.js"
import { connecttomongodb } from "../connect.js"

function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol == "http:" || url.protocol == "https:";
  } catch (error) {
    return false;
  }
}

function isValidAlias(alias) {
  return /^[a-zA-Z0-9_-]{3,30}$/.test(alias);
}


async function handleGenerateNewShortURL(req, res) {
  const { url } = req.body;
  const { alias } = req.body;
  if (!url || !isValidURL(url)) {
    return res.status(400).json({ message: "Invalid URL" });
  }
  let shortId = nanoid(8);
  if (!isValidAlias(alias)) {
    return res.status(400).json({ message: "Invalid Alias" });
  } else {
    shortId = alias;
  }
  await URLModel.create({
    shortId: shortId,
    redirectURL: url,
    userId: req.user.userId,
    visitHistory: []
  })
  return res.status(201).json({ id: shortId })
}

async function entryfunc(req, res) {
  try {
    const urls = await URLModel.find({ isDeleted: false })
    if (!urls) {
      res.status(404).json({ message: "Url has been deleted" })
    }
    const { shortId } = req.params;
    const entry = await URLModel.findOneAndUpdate({
      shortId,isDeleted:false
    }, {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
          ip: req.ip,
          userAgent: req.headers["user-agent"]
        }
      }
    });
    if (!entry) {
      return res.status(404).json({ message: "Id not found" });
    }
    res.redirect(entry.redirectURL);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

async function getAnalytics(req, res) {
  const urls = await find({ isDeleted: false })
  if (!urls) {
    res.status(404).json({ message: "Url has been deleted" })
  }
  const { shortId } = req.params;
  const result = await URLModel.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory
  });
};

async function getMyUrl(req, res) {
  try {
    const urls=await URLModel.find({isDeleted:false})
    if (!urls){
      res.status(404).json({message:"Url has been deleted"})
    }
    const url = await URLModel.findOne({
      userId: req.user.userId
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteURL(req, res) {
  const { shortId } = req.params;
  const url=await URLModel.findOne({shortId});
  if (!url){
    return res.status(404).json({message:"Url Not Found"});
  }
  if (url.isDeleted){
    return res.status(409).json({message:"URL already deleted"})
  }
  await URLModel.updateOne(
    {shortId},
    {isDeleted: true, deletedAt: new Date()}
  )
  await URLModel.deleteMany({ //perma delete after 30 days
    isDeleted:true,
    deletedAt:{
      $lt:
        new Date(Date.now()-30*24*60*60*1000) //auto delete after 30 days
    }
  })
  res.status(200).json({ message: "Successfully deleted" });
}

async function restoreURL(req, res) {
  const { shortId } = req.params;
  const url=await URLModel.findOne({shortId});
  if (!url){
    res.status(404).json({message:"URL is permanently deleted"});
  }
  await URLModel.updateOne(
    {shortId},
    {isDeleted: false, deletedAt: null}
  )
  res.status(200).json({ message: "Successfully Restored" });
}

export { handleGenerateNewShortURL, entryfunc, getAnalytics, getMyUrl, deleteURL, restoreURL }