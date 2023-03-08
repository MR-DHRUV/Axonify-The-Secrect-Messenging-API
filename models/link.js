const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    reciever : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now(),
        required : true
    },
    exp : {
        type : Date,
        required : true
    },
    url : {
        type : String,
        required : true
    },
})


const LinkStore = mongoose.model('links_axonify',LinkSchema);
module.exports = LinkStore;