const mongoose=require('mongoose');
let { Schema, model } =require('mongoose') ;


const DocumentSchema=new Schema({
    _id:String,
    data:Object,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

const document = mongoose.model('documents', DocumentSchema);
module.exports = document;