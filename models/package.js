const mongoose = require('mongoose');

const Package = mongoose.model('Package', new mongoose.Schema({
    package: {
        type:String,
        required: true,
    },
    depends: [[String]],
    description: {
        type: String,
        required: true,
        maxlength: 2048
    },
    installed_size: String,
    section: String,
    reverseDeps: [String]
   

}));

exports.Package = Package;