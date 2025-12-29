import { nanoid } from "nanoid";
import { URL } from "../models/url.models.js"
import { connecttomongodb } from "../connect.js"

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(404).json({ message: "Not found url" });
  }
  const shortId = nanoid(8);
  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: []
  })
  return res.status(200).json({ id: shortId })
}

async function entryfunc(req, res) {
  try {
    const { shortId } = req.params;
    const entry = await URL.findOneAndUpdate({
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
  const result=await URL.findOne({shortId});
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics:result.visitHistory
  });
};

export { handleGenerateNewShortURL, entryfunc, getAnalytics }