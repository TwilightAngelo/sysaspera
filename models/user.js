var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    unique: false,
  },
  google: {
    id: {
      type: String,
    },
    token: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    required: false,
  }
});

UserSchema.methods.verifyPassword = function (givenPassword) {
  if (this.password == givenPassword) {
    console.log(this.password + 'in user');
    console.log(givenPassword + 'in user given!');
    return true;
  } else {
    console.log(this + 'in user false');
    //console.log(givenPassword + 'in user given! false');
    return false;
  }
};

module.exports = mongoose.model('User', UserSchema, 'users');
