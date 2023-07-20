const router=require('express').Router();
const userController=require('../controllers/userController')
const requireUser=require('../middlewares/requireUser')

router.post('/follow',requireUser,userController.followOrUnfollowUserController)
router.get('/getFeedData',requireUser,userController.getPostsOfFollowing)
router.get('/getMyPosts',requireUser,userController.getMyPostsController);
router.get('/userPosts',requireUser,userController.getUserPostsController)
router.delete('/delete',requireUser,userController.deleteMyProfileController)
router.get('/getMyInfo',requireUser,userController.getMyInfo)
router.put('/',requireUser,userController.updateUserProfile)
router.post('/getUserProfile',requireUser,userController.getUserProfileController)
module.exports=router