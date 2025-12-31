import express from 'express';
import { handleGenerateNewShortURL,entryfunc, getAnalytics} from "../controller/url.controller.js";
import { limiter } from "../controller/url.ratelimiter.js";
const router=express.Router();

router.post("/",limiter,handleGenerateNewShortURL);
export {router}
