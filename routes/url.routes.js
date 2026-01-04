import express from 'express';
import { handleGenerateNewShortURL,entryfunc, getAnalytics} from "../controller/url.controller.js";
import { limiter } from "../controller/url.ratelimiter.js";
import {authMiddleware} from "../middleware/auth.middleware.js"
const router=express.Router();

router.post("/",limiter,authMiddleware,handleGenerateNewShortURL);
export {router}
