import express from 'express'
import { logincontroller, registercontroller, updatepassword, updateprofile, updateprofilpic, userlogout, userprofile } from '../controllers/usercontroller.js'
import {isauth} from '../middlewares/authmiddleware.js'
import { singleupload } from '../middlewares/multer.js';
import ratelimit from 'express-rate-limit';

//rate limiter
const limiter=ratelimit({
    windowms:15*60*1000,
    limit:100,
    standardHeaders:'draft-7',
    legacyHeaders:false,
})

//router object()
const router=express.Router()

//routes
//register
router.post('/register',limiter,registercontroller);

//login
router.post('/login',limiter,logincontroller);

//profile
router.get('/profile',isauth,userprofile);

//logout
router.get('/logout',isauth,userlogout);

//update profile
router.put('/update',isauth,updateprofile);

//update password
router.put('/updatepassword',isauth,updatepassword);

//update profile pic
router.put('/updateprofilepic',isauth,singleupload,updateprofilpic);

//export
export default router