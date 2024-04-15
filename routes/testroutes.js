import express from 'express'
import { testcontroller } from '../controllers/testcontroller.js '

//router object
const router=express.Router()


//routes
router.get("/test",testcontroller);





//export
export default router