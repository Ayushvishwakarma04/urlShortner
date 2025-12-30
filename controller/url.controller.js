import { nanoid } from "nanoid";
import { URL as URLModel } from "../models/url.models.js"
import { connecttomongodb } from "../connect.js"

function isValidURL(string){
  try {
    const url = new URL(string);
    return url.protocol=="http:" || url.protocol=="https:";
  } catch (error) {
    return false;
  }
}

async function handleGenerateNewShortURL(req, res) {
  const {url} = req.body;
  if (!url || !isValidURL(url)) {
    return res.status(400).json({ message: "Invalid URL" });
  }
  const shortId = nanoid(8);
  await URLModel.create({
    shortId: shortId,
    redirectURL: url,
    visitHistory: []
  })
  return res.status(201).json({ id: shortId })
}

async function entryfunc(req, res) {
  try {
    const { shortId } = req.params;
    const entry = await URLModel.findOneAndUpdate({
      shortId
    }, {
      $push: { visitHistory: { timestamp: Date.now() } }
    });
    if (!entry) {
      return res.status(404).json({ message: "Id not found" });
    }
    res.redirect(entry.redirectURL);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

async function getAnalytics(req,res){
  const {shortId} = req.params;
  const result=await URLModel.findOne({shortId});
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics:result.visitHistory
  });
};

export { handleGenerateNewShortURL, entryfunc, getAnalytics }