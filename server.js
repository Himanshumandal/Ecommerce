import express from "express";
import colors from "colors";
import morgan  from 'morgan';
import cors from "cors";
import dotenv from 'dotenv';
import cookie from "cookie-parser";
import cloudinary from 'cloudinary'
import Stripe from 'stripe'
import helmet from 'helmet'
import mongosanitize from 'express-mongo-sanitize'

import connectdb from "./config/db.js";

//dot env config
dotenv.config();

//database connection
connectdb();

//stripe configuration
export const stripe =new Stripe(process.env.stripe_api_secret);

//cloudinary config
cloudinary.v2.config({
    cloud_name:process.env.cloudinary_name,
    api_key:process.env.cloudinary_api_key,
    api_secret:process.env.cloudinary_secret,
});

//rest object
const app=express();


//middlewares
app.use(morgan('dev'));
app.use(express.json())
app.use(cors());
app.use(cookie());
app.use(helmet());
app.use(mongosanitize());


//route

//routes files imports
import testroutes from './routes/testroutes.js';
import userroutes from './routes/userroutes.js';
import productroute from "./routes/productroute.js";
import categoryroute from "./routes/categoryroutes.js";
import orderroute from "./routes/orderroute.js";
import ExpressMongoSanitize from "express-mongo-sanitize";

app.use('/api/v1',testroutes); 
app.use('/api/v1/user',userroutes);
app.use('/api/v1/product',productroute);
app.use('/api/v1/category',categoryroute);
app.use('/api/v1/order',orderroute);

app.get('/',(req,res)=>{
    return res.status(200).send("<h1> Welcome to node  </h1>");

});




//port
const port=process.env.port|| 8080;


//listen
app.listen(port,()=>{
    console.log(`Server Running on port ${port} on ${process.env.node_env} mode`.bgMagenta.white);
});