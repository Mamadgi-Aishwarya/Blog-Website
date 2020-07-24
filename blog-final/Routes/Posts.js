const express = require('express');
const bodyParser = require('body-parser');
const passport = require("passport");
const sanitizeHtml=require('sanitize-html');
const Post=require('../Models/Post');
const User=require('../Models/User');
const auth=require('../Authentication/authenticate');
const PostRouter = express.Router();
PostRouter.use(bodyParser.json());
PostRouter.use(passport.initialize());
PostRouter.use(passport.session());

function sanitize(text){
  var ans=sanitizeHtml(text,{
    allowedTags: [ ],
    allowedAttributes: {}
  });
  return ans;
}

PostRouter.route("/").get(function(req,res){
    Post.find().sort([['createdAt', -1]]).then((posts,err)=>{
      res.render("home",{posts:posts});
    }).catch(err=>   req.flash('error',"Something went wrong!Try again!"));
});

PostRouter.route("/compose").get(auth,function(req,res){
    res.render("compose");
  })
  .post(auth,async function(req,res){
    if(req.body.postTitle==="" || req.body.postBody===""){
       req.flash('error',"Please fill both title and content fields!");
    }
 //   req.body.postBody=req.body.postBody.replace(/\n/g ,"<br><br>");
    const post=new Post({
      Title:sanitize(req.body.postTitle),
      Content:sanitize(req.body.postBody),
      Author:{id:req.user._id,name:sanitize(req.user.name)}
      });
      post.save();
      await User.findOne({_id:req.user._id}).then(function(result,err){
        result.posts.push(post._id);
        result.save();
        req.flash('success',"Post created successfully!");
       res.redirect("/post/"+post._id);
      }).catch(err=>  { req.flash('error',"Something went wrong!Try again!")
            res.redirect("post-edit",{post:post});
         });
});
  
PostRouter.route("/:postId").get(function(req,res){
      const requestedTitle=sanitize(req.params.postId);
      Post.findOne({_id:requestedTitle}).then(function(result,err){
        res.render("post",{post:result});
      }).catch( err=>  req.flash('error',"Something went wrong!Try again!"));
});
  
PostRouter.route("/:postId/edit").post(auth,function(req,res){
      const requestedTitle=sanitize(req.params.postId);
      Post.findOne({_id:requestedTitle}).then(function(result,err){
        res.render("post-edit",{post:result});
      }).catch(err=>   req.flash('error',"Something went wrong!Try again!"));
});
  
PostRouter.route("/:postId/edited").post(auth,function(req,res){
      const requestedTitle=sanitize(req.params.postId);
  //    req.body.content=req.body.content.replace(/(?:\[rn]|[\r\n])+/g ,"");
      Post.updateOne({_id:requestedTitle},{ $set: {Title:sanitize(req.body.title), Content:sanitize(req.body.content)} }).then(function(result,err){
         req.flash('success',"Post edited successfully!");
          try {
            res.redirect("/post/"+requestedTitle);
          } catch (error) {
             req.flash('error',"Something went wrong!Try again!");
          }
      }).catch(err=> req.flash('error',"Something went wrong!Try again!"));
});
  
PostRouter.route("/:postId/delete").post(auth,function(req,res){
      const requestedTitle=sanitize(req.params.postId);
      const ans=req.body.confirmation;
      if(ans==="yes"){
      Post.deleteOne({_id:requestedTitle}).then(function(result,err){
         req.flash('success',"Post deleted successfully!");
        res.redirect('/');
      }).catch(err=> req.flash('error',"Something went wrong!Try again!"));
      }
      else{
        req.flash('success',"Post is not deleted !");
        res.redirect("/post/"+requestedTitle);
      }
});

PostRouter.route("/search").post(function(req,res){
        Post.find( { Content: { $regex:sanitize(req.body.search),$options:"$i"} }).sort([['createdAt', -1]])
         .then(posts=>{
           if(posts.length==0){
             req.flash('error',"No results found");
             res.redirect('/');
           }
           else
           res.render("home",{posts:posts});
         })
         .catch(e =>  {
           console.log(e);
           req.flash('error',"Something went wrong!Try again!");
           res.redirect('/')});
});
module.exports = PostRouter;