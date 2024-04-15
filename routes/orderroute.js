import express from 'express';
import { isadmin, isauth } from '../middlewares/authmiddleware.js';
import { changeorder, createorder, getmyorder, orderpayment, singleorder } from '../controllers/ordercontroller.js';
import { getallcategory } from '../controllers/categorycontroller.js';

const router=express.Router();

//routes
//============Order routes=============

//Create Category
router.post('/create',isauth,createorder);
//Get all orders
router.get('/getall',isauth,getmyorder);
//get single order
router.get('/:id',isauth,singleorder);
//accept payments
router.post('/payments',isauth,orderpayment);

// Admin Part
router.get('/admin/get-all-order',isauth,isadmin,getallcategory)


//change order status
router.put('/admin/order/:id',isauth,isadmin,changeorder);







//export
export default router;