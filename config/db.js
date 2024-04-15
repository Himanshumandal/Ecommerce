import mongoose from 'mongoose'
import colors from 'colors'

const connectdb=async()=>{
    try{
        await mongoose.connect(process.env.mongo_url);
        console.log(`Mongodb Connected ${mongoose.connection.host}`.bgYellow.white);

    }
    catch(error)
    {
        console.log(`Mongodb error ${error}`.bgRed.white);
    }
};

export default connectdb;
