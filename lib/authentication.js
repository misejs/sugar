var passport = require('passport');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;

var userCollection;

passport.serializeUser(function(user,done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  if(!userCollection) return done(null,null);
  userCollection.findById(id, done);
});

module.exports = function(config){
  config = config || {};
  if(!config.db) throw new Error('You must pass a db to the authentication module.');
  if(!config.User) throw new Error('You must pass a user model to the authentication module.');

  var User = config.User;
  var users = userCollection = config.db[User.collection];

  passport.use(new LocalStrategy(
    function(username,password,done){
      users.findOne({username : username},function(err, user){
        if(err) return done(err);
        if(!user) return done(null,false,{message : 'Incorrect username.'});
        if(!bcrypt.compareSync(user.password,password)){
          return done(null,false,{message : 'Incorrect password.'});
        } else {
          return done(null,user);
        }
      });
    }
  ));

  return {
    middleware : passport.initialize(),
    authenticate : passport.authenticate('local',{
      successRedirect : config.successRedirect || '/admin',
      failureRedirect : config.failureRedirect || '/admin/login'
    })
  }
};
