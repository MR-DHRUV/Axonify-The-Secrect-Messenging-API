const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender : {
        type : String,
        required : true
    },
    reciever : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now(),
        required : true
    },
    msg : {
        type : String,
        required : true
    },
})


const MessageStore = mongoose.model('music',MessageSchema);
module.exports = MessageStore;