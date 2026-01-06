import QRCode from "qrcode";
import {URL as URLModel} from "../models/url.models.js";

async function qrGen(req,res){
  try {
    const {shortId} = req.params;
    const entry = await URLModel.findOne({shortId});
    if (!entry){
      return res.status(404).json({message:"Invalid short url"});
    }
    const qrUrl=`${req.protocol}://${req.get("host")}/${shortId}`;
    const qrCode=await QRCode.toDataURL(qrUrl)
    if (!qrCode){
      return res.status(500).json({message:"Qr couldn't be generated"});
    }
    return res.json({qrCode});
  } catch (error) {
    return res.status(500).json(error);
  }
}

export {qrGen}