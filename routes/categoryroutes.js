import express from 'express';
import { isauth ,isadmin} from '../middlewares/authmiddleware.js';
import { singleupload } from '../middlewares/multer.js';
import { createcategory, deletecategory, getallcategory, updatecategory } from '../controllers/categorycontroller.js';
const router=express.Router();

//routes
//============Category routes=============

//Create Category
router.post('/create',isauth,isadmin,createcategory);

//Get all Category
router.post("/get-all",getallcategory);

//Get all category
router.delete("/delete/:id",isauth,isadmin,deletecategory);

//Get all category
router.put("/update/:id",isauth,isadmin,updatecategory);




//export
export default router;