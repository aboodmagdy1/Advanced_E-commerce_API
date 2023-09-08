
//security Only return what is necessary
exports.sanitizeUser = function(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  };

  //there is a another good way to make this 
  //go to schema and make select : false for unnecessary fileds 