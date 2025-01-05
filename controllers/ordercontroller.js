import{stripe} from "../server.js";
import ordermodel from "../models/ordermodel.js";
import productmodel from "../models/productmodel.js";



//create orders
export const createorder=async(req,res)=>{
    try{
         // productpaymentinfo,
        const {
            shippinginfo,
            orderitems,
            paymentmethod,
            itemprice,
            tax,
            shippingcharges,
            totalamount,
        }=req.body;

        //validation
        if(!shippinginfo || !orderitems||!paymentmethod||!itemprice||!tax||!shippingcharges||!totalamount)
        {
            return res.status(404).send({
                success:false,
                message:"Provide all field "
            });
        }

        //create order
        //productaymentinfo,
        await ordermodel.create({
            user:req.user._id,
            shippinginfo,
            orderitems,
            paymentmethod,
            
            itemprice,
            tax,
            shippingcharges,
            totalamount
        })

        //stock update
        for(let i=0; i<orderitems.length;i++)
        {
            //find product
            const product=await productmodel.findById(orderitems[i].product)
            product.stock-=orderitems[i].quantity;
            await product.save();
        }
        res.status(201).send({
            success:true,
            message:"order Placed Successfully",
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"order api problem",
            error
        });
    }
};

//Get all orders -MY orders
export const getmyorder=async(req,res)=>{
    try{
        //find orders
        const orders=await ordermodel.find({user:req.user._id})
        //validation
        if(!orders)
        {
            return res.status(404).send({
                success:true,
                message:"no orders found",
                

            });
        }
        res.status(200).send({
            success:true,
            message:"your order data",
            totalorder:orders.length,
            orders,
        });

    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in my orders api",
            error
        });
    }
};

//Single order 
export const singleorder=async(req,res)=>{
    try
    {
        //find orders
        const orders=await ordermodel.findById(req.params.id);
        if(!orders)
        {
            return res.status(404).send({
                success:true,
                message:"no orders found",
                

            });
        }
        res.status(200).send({
            success:true,
            message:"your order fetched",
            totalorder:orders.length,
            orders,
        });
    }
    catch(error)
    {
        console.log(error);
        //cast error || OBJECT ID
        if(error.name==='CastError')
   return res.status(500).send( {
        success:false,
        message:"Invalid id",
    });
        res.status(500).send({
            success:false,
            message:"error in single order api problem",
            error,
        });
    }
};

//payment methods
export const orderpayment=async(req,res)=>{
    try{
        //get amount
        const {totalamount}=req.body;
        //validation
        if(!totalamount)
        {
            return res.status(404).send({
                success:false,
                message:"total amount is required"
            })
        }
        const {client_secret}=await stripe.paymentIntents.create({
            amount:Number(totalamount),
            currency:"inr",
        })
        res.status(200).send({
            success:true,
            message:"Payment successfully",
            client_secret
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in get up",
            error,
        });
    }
};


// Admin Section

//Get all orders

export const getallorder=async(req,res)=>{
    try
    {
        const orders=await ordermodel.find({});
        res.status(200).send({
            success:true,
            message:"All orders data",
            totalorder:orders.length,
            orders,
        });
    }
    catch(error)
    {
        
            console.log(error);
            res.status(500).send({
                success:false,
                message:"error in get up",
                error,
            });
        
    }
};

//change order controllers
export const changeorder=async(req,res)=>{
     try
     {
        //find order
        const order=await ordermodel.findById(req.params.id);
        //validation
        if(!order)
        {
            return res.status(404).send({
                success:false,
                message:"order not found"
            })
        }
        if(order.orderstatus==="processing")
        order.orderstatus='shipped'
        else if(order.orderstatus==='shipped'){
          order.orderstatus='delivered'
          order.deliveredat= Date.now();
        }
        else{
            return res.status(500).send({
                success:false,
                message:"Order is already delivered"
            })
        }
        await order.save()
        res.status(200).send({
            success:true,
            message:"Order status updated",
        })
     }
     catch(error)
     {
        console.log(error);
        //cast error || OBJECT ID
        if(error.name==='CastError')
   return res.status(500).send( {
        success:false,
        message:"Invalid id",
    });
        res.status(500).send({
            success:false,
            message:"error in single order api problem",
            error,
        });
     }
};