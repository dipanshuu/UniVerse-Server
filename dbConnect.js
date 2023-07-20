const mongoose=require('mongoose')
module.exports=async()=>{
    const mongoUri='mongodb+srv://dipanshuu0427:Qhue0X6STXsZ2wXv@cluster0.azlz2cp.mongodb.net/?retryWrites=true&w=majority'
    try{
        const connect=await mongoose.connect(mongoUri,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
        })
        
    }
    catch(e){
       
        process.exit(1)
    }
}