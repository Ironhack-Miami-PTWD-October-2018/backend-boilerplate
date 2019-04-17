const passport =require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../../models/user-model');

passport.use(new LocalStrategy({
  usernameField: 'email', // <== this step we take because we don't use username but email to register and login users
  // if we use username we don't have to put this object:{ usernameField: 'email }
  passwordField:'originalPassword'
},(email, password, next) => {
  User.findOne({ email })
  .then(userFromDb => {
    if(!userFromDb){
      return next(null, false, { message: 'Incorrect email!' })
    }

    // when we added the social logins, not all the users in the DB have 'password' field
    // because that is not required for social logins
    // so if the user has the password, it means they use local strategy when login
    if(userFromDb.encryptedPassword){
      if(!bcrypt.compareSync(password, userFromDb.encryptedPassword)){
        return next(null, false, { message: 'Incorrect password!' })
      }
    } 
    return next(null, userFromDb)
  })
  .catch( err => next(err))
}));