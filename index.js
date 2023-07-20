const express=require('express')
const app=express()
const dotenv=require('dotenv')
const dbConnect=require('./dbConnect')
const authRouter=require('./routers/authRouter')
const morgan=require('morgan')
const postsRouter=require('./routers/postsRouter')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const userRouter=require('./routers/userRouter')
const cloudinary=require('cloudinary').v2;
dotenv.config('./.env')
console.log(process.env.CLOUDINARY_API_KEY)
cloudinary.config({ 
    secure:true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
const PORT=process.env.PORT || 4001
//middlewares

app.use(express.json({limit:'10mb'}))
console.log('here env',process.env.NODE_ENV)
let origin='http://localhost:3000';
if(process.env.NODE_ENV==='production'){
    origin=process.env.CORS_ORIGIN
}
app.use(cors({
    credentials:true,
    origin:process.env.CORS_ORIGIN
}))
app.use(morgan('common'))
app.use(cookieParser())
app.use('/auth',authRouter)
app.use('/post',postsRouter)
app.use('/user',userRouter)
dbConnect()
app.get('/',(req,res)=>{
res.status(200).send('OK!!!')
})
app.listen(PORT,()=>{
    console.log(`Running on port:${PORT}`)
})