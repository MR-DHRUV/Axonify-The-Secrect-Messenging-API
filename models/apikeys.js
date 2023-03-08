const mongoose = require('mongoose');


const KeySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    public_key: {
        type: String,
        required: true
    },
    private_key: {
        type: String,
        required: true
    },

})


const KeyStore = mongoose.model('key', KeySchema);
module.exports = KeyStore