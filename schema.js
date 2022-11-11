const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    comment_id: mongoose.Schema.Types.ObjectId ,
    post_id:mongoose.Types.ObjectId,
    comment:{
        type:String ,
        required:true,
    }
}
,{timestamps:true}
)

const postSchema=new mongoose.Schema({
    post_id: mongoose.Schema.Types.ObjectId ,
    user_id: mongoose.Types.ObjectId,
    title:{
        type:String, 
        required:true,
    },
    desc:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default: 0,
    }
},{timestamps:true})

const userSchema=new mongoose.Schema({
    user_id : mongoose.Schema.Types.ObjectId,
    username:{
        type:String,
        required: true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    following :[mongoose.Types.ObjectId],
    followers:[mongoose.Types.ObjectId]
})