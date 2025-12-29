import express from 'express';
import { handleGenerateNewShortURL,entryfunc, getAnalytics} from "../controller/url.controller.js";
const router=express.Router();

router.post("/",handleGenerateNewShortURL);
export {router}
