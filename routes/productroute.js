import express from 'express';
import { isauth ,isadmin} from '../middlewares/authmiddleware.js';
import { singleupload } from '../middlewares/multer.js';
import { createproduct, deleteimgcontroller, deleteproductcontroller, getallproduct, getsingleproduct, updateimgcontroller, updateproductcontroller } from '../controllers/productcontroller.js';

const router=express.Router();

//routes
//get all products
router.get('/get-all',getallproduct);

//get single products
router.get("/:id",getsingleproduct);

//create product
router.post('/create',isauth,isadmin,singleupload, createproduct);

//update product
router.put('/:id',isauth,isadmin,updateproductcontroller);

//update product image
router.put('/image/:id',isauth,isadmin,singleupload,updateimgcontroller);

//delete product 
router.delete('/delete-image/:id',isauth,isadmin,deleteimgcontroller);

//delete product 
router.delete('/delete/:id',isauth,isadmin,deleteproductcontroller);

//export
export default router;