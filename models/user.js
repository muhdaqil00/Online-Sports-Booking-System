var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	Fname: {
        type: String,
        required: true
    },
    Lname: {
        type: String,
        required: true
    }, 
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
	password: {
        type: String,
        required: true
    },
	passwordConf: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },

})
User = mongoose.model('User', userSchema)

module.exports = User