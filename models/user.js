'use strict';
module.exports = (sequelize, DataTypes) => {
  const Op = sequelize.Op
  const bcrypt = require('bcryptjs');
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: {
      type : DataTypes.STRING,
      validate : {
        isEmail : true,
        isUnique : function (value) {
          return User.findOne( { where : { email : value, id : {[Op.ne] : this.id } } } )
            .then( user => {
              if (user) {
                throw 'Email is already used!'
              }
            })
            .catch( err=> {
              throw err
            })
        } 
      }
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };

  User.beforeCreate((user) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash
  });

  return User;
};