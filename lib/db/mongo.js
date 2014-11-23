var mongo = require('mongo-wrapper');

module.exports = function(config,models){
  mongo.setup(config);
  Object.keys(models).forEach(function(name){
    mongo.db.add(models[name].prototype.collection);
  });
  return mongo.db;
};
