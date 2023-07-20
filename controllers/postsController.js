const Post = require("../models/Post")
const User = require("../models/User")
const { success, error } = require("../utils/responseWrapper")
const cloudinary=require("cloudinary").v2;
const {mapPostOutput}=require("../utils/Utils")
const getAllPostsController=async(req,res)=>{

return res.send(success(200,'These are all the posts'))
}

const createPostController=async(req,res)=>{
    try{
        const {caption,postImg}=req.body;
        if(!caption || !postImg){
            return res.send(error(400,"Caption and postImage are required"))
        }
        
            const cloudImg=await cloudinary.uploader.upload(postImg,{
                folder:'postImage',
                public_id: process.env.CLOUDINARY_API_KEY
            })
        
    const owner=req._id
    const user=await User.findById(req._id)
    const post=await Post.create({
        owner,
        caption,
        image:{
            publicId:cloudImg.public_id,
            url:cloudImg.url
        }
    })
    user.posts.push(post._id)
    await user.save()
    return res.send(success(201,post))
    }
    catch(e){
        res.send(error(500,e.message))
    }
}

const likeAndUnlikePost=async(req,res)=>{
    try{
        const {postId}=req.body;
        const curUserId=req._id
        const post=await Post.findById(postId).populate('owner')
        if(!post){
            return res.send(error(404,"Post does not exist"))
        }
        if(post.likes.includes(curUserId)){
            const index=post.likes.indexOf(curUserId)
            post.likes.splice(index,1);
            
        }
        else{
            post.likes.push(curUserId)
            
        }
        await post.save();
            return res.send(success(200,{post:mapPostOutput(post,req._id)}))
    }
    catch(e){
return res.send(error(500,e.message))
    }

}

const updatePostController=async(req,res)=>{
    try{
const {postId,caption}=req.body;
const curUserId=req._id;
const post=await Post.findById(postId)
if(!post){
    return res.send(error(404,"Post not found"));
}
if(post.owner.toString()!==curUserId){
    return res.send(error(403,'Only Owners allowed!!!'));
}
if(caption){
    post.caption=caption;
}

await post.save();
return res.send(success(200,{post}))
    }
    catch(e){
return res.send(error(500,e.message))
    }
}

const deletePostController=async(req,res)=>{
    try{
        const {postId}=req.body;
        const curUser=req._id;
        const post=await Post.findById(postId)
        const user=await User.findById(curUser)
        if(!post){
            return res.send(error(404,"Post not found!!!"))
        }
        if(post.owner.toString()!==curUser){
            return res.send(error(403,"Only Owners allowed to delete post!!!"))
        }
        const index=user.posts.indexOf(postId);
        user.posts.splice(index,1)
        await user.save();
        await post.deleteOne();
        return res.send(success(200,"Post Deleted Successfully!!!"))
    
    }
    catch(e){
return res.send(error(500,e.message))
    }
}
module.exports={
    getAllPostsController,
    createPostController,
    likeAndUnlikePost,
    updatePostController,
    deletePostController
    
}