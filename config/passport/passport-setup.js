const passport = require("passport");

const User = require("../../models/user-model.js");

require('./local-strategy');


// serializeUser(): defines what data to save in the session
// (happens when you log in successfully)
passport.serializeUser((userDoc, done) => {
  console.log("SERIALIZE (save user ID to session) 🐋");

  // call done() with null and the result if it's successful
  // (the result is the user's ID that we want to save in the session)
  done(null, userDoc._id);
});

// deserializeUser(): defines how to retrieve the user information from the DB
// (happens automatically on EVERY request AFTER you log in)
passport.deserializeUser((userId, done) => {
  console.log("DESERIALIZE (retrieving user info from the DB) 🐓");

  User.findById(userId)
    .then(userDoc => {
      // call done() with null and the result if it's successful
      // (the result is the user document from the database)
      done(null, userDoc);
    })
    // call done() with the error object if it fails
    .catch(err => done(err));
});


function passportBasicSetup(theApp){

  // passport super power is here:
  theApp.use(passport.initialize()); // <== 'fires' the passport package
  theApp.use(passport.session()); // <== connects passport to the session
}

module.exports = passportBasicSetup;
