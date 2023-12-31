const mongoose=require('mongoose')
const UserSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    bio:{
type:String,
    },
    avatar:{
        publicId:String,
        url:String 
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Users'
        }
    ],
    followings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Users'
        }
    ],
posts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }
]

},{
    timestamps:true
})
module.exports=mongoose.model('Users',UserSchema)