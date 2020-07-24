const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://Admin:minnu@mongodb01.irdlb.mongodb.net/PostDB?retryWrites=true&w=majority",{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true},function(err,db){
  if (err) {
      console.log('Unable to connect to the server. Please start the server. Error:', err);
  } else {
      console.log('Connected to Server successfully!');
  }});
var PostSchema = new Schema({
Title:String,
Content:String,
Author:{
    id:mongoose.Schema.Types.ObjectId,
    name:String
    }
},{
    timestamps: true
  });

const Post=mongoose.model("Post",PostSchema);
module.exports=Post;