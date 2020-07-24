var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Admin:minnu@mongodb01.irdlb.mongodb.net/PostDB?retryWrites=true&w=majority",{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true},function(err,db){
    if (err) {
        console.log('Unable to connect to the server. Please start the server. Error:', err);
    } else {
        console.log('Connected to Server successfully!');
    }
});
const User={
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    password:  {
        type: String,
        required: true
    },
    posts:[{
        type :mongoose.Schema.Types.ObjectId, 
        ref: 'Post'
    }]
};
 
module.exports = mongoose.model('User', User);