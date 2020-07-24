const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const passport = require("passport");
const session = require('express-session');
const postRouter=require('./Routes/Posts');
const userRouter=require('./Routes/Users');
const Post=require('./Models/Post');
const User=require('./Models/User');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
  secret:"secret",
  resave:false, //this means session variables are not resaved if nothing/ is changed
  saveUninitialized:false, //this means we dont want to save empty value in session if there is no value 
 cookie:{maxAge:315360000}
}))

app.use(passport.initialize());
app.use(passport.session());
const flash = require('connect-flash');
const { getMaxListeners } = require("./Models/Post");
//const { isNull } = require("lodash");
app.use(flash());
const initializePassport=require('./Authentication/passport-config')(passport);
app.use(function(req, res, next) {
  // make all error and success flash messages available from all templates
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");

  // make user session data available from within view templates
  res.locals.user = req.user;
  next();
})


app.get("/",function(req,res){
  Post.find().sort([['createdAt', -1]]).then((posts,err)=>{
    res.render("home",{posts:posts});
  }).catch(err=>  
    res.render('404')
  )
});  

app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
})
