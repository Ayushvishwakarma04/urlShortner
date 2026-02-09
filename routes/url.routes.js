import express from 'express';
import { handleGenerateNewShortURL,entryfunc, getAnalytics, deleteURL, restoreURL} from "../controller/url.controller.js";
import { limiter } from "../controller/url.ratelimiter.js";
import {authMiddleware} from "../middleware/auth.middleware.js"
import { qrGen } from '../controller/qr.controller.js';
const router=express.Router();

router.post("/",limiter,authMiddleware,handleGenerateNewShortURL);
router.get("/:shortId",entryfunc);
router.get("/:shortId/qr",qrGen);
router.post("/:shortId/delete",deleteURL);
router.post("/:shortId/delete",deleteURL);
router.post("/:shortId/restore",restoreURL);
export {router}
