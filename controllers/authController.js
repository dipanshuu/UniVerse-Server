const user=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {error, success}=require("../utils/responseWrapper")
const signupController=async(req,res)=>{
try{
const {name,email,password}=req.body
if(!email || !password || !name){
    
    return res.send(error(400,'All fields are required'))

}
const oldUser=await user.findOne({email})
if(oldUser){
    
    return res.send(error(409,'User already exists'))
}
const hashedPassword=await bcrypt.hash(password,10)
const User=await user.create({
    name,
    email,
    password:hashedPassword
})

return res.send(success(201,{User}))

}
catch(error){
res.status(404).send('Error while Signup!!!',error)
}
}

const loginController=async(req,res)=>{
try{
const {email,password}=req.body
if(!email || !password){
    
    return res.send(error(400,'All fields are mandatory'))
}
const User=await user.findOne({email})
if(!User){
    
    return res.send(error(404,'User Not Registerd!!!'))
}
const matched=await bcrypt.compare(password,User.password)
if(!matched){

    return res.send(error(403,'Login Credentials are incorrect'))
}
const accessToken= generateAccessToken({_id:User._id})
const refreshToken=refreshAccessToken({_id:User._id})
res.cookie('jwt',refreshToken,{
    httpOnly:true,
    secure:true,
})

return res.send(success(201,{accessToken}))

}
catch(error){
return res.send('Error while logging!!!',error)
}
}

//this api will check the refreshToken validity and generate a new access token

const refreshAccessTokenController=async(req,res)=>{

    const cookies=req.cookies;
    console.log(cookies)
    if(!cookies.jwt){
        
        return res.send(error(401,'Refresh Token in cookie is Required!!!'))
    }
    const refreshToken=cookies.jwt;
    
    if(!refreshToken){

        return res.send(error(401,'Refresh Token is Required!!!'))
    }
    try{
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_PRIVATE_KEY)
        const _id=decoded._id
        const accessToken=generateAccessToken({_id})

       return res.send(success(201,{accessToken}))
            }
            
            catch(e){
                return res.status(401).send('Invalid Refresh Token key!!!')
            }
}

const logoutController=async(req,res)=>{
try{
res.clearCookie('jwt',{
    httpOnly:true,
    secure:true
    
})
return res.send(success(200,'user logged out'))
}
catch(e){
return res.send(error(500,e.message))
}
}

//internal functions
const generateAccessToken=(data)=>{
    const token=jwt.sign(data,process.env.ACCESS_TOKEN_PRIVATE_KEY,{
        expiresIn:'36000s'
    });

    
    console.log(token)
    return token
}


const refreshAccessToken=(data)=>{
    const token=jwt.sign(data,process.env.REFRESH_TOKEN_PRIVATE_KEY,{
        expiresIn:'1y'
    });
    
    console.log(token)
    return token
}

module.exports={
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController
}