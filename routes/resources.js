var Resource = require('express-resource');

var setupResources = function(models,db){
  var resources = {};
  var parseId = function(id){
    try {
      return db.id(id);
    } catch(e){
      return null;
    }
  }

  // set up resources for our models
  Object.keys(models).forEach(function(key){
    var Model = models[key];
    var name = Model.prototype.collection;
    var collection = db[name];
    resources[name] = {};
    resources[name].index = function(req,res){
      collection.findArray({},function(err,arr){
        if(err){
          res.send(500,err);
        } else {
          res.json(arr);
        }
      });
    };
    resources[name].create = function(req,res){
      var newResource = new Model(req.body);
      collection.insert(newResource,function(err){
        if (err) {
          res.send(500,err);
        } else {
          res.json(newResource);
        }
      });
    }
    resources[name].show = function(req,res){
      collection.findOne(req.params[0],function(err,item){
        if(err){
          res.send(500,err);
        } else {
          res.json(item);
        }
      });
    };
    resources[name].update = function(req,res){
      var id = parseId(req.params[key.toLowerCase()]);
      if(!id){
        res.send(406,'{"error" : "invalid id"}');
      } else {
        // don't allow update on id
        delete req.body._id;
        var info = new Model(req.body);
        collection.findAndModifyById(id,null,{$set:info.toObject()},{new:true},function(err,item){
          if(!err && !item){
            res.send(404,'Item not found');
          } else if(err){
            res.send(500,err);
          } else {
            res.json(item);
          }
        });
      }
    };
    resources[name].destroy = function(req,res){
      var id = parseId(req.params[key.toLowerCase()]);
      if(!id){
        res.send(406,'{"error" : "invalid id"}');
      } else {
        collection.remove({_id : id},function(err){
          if(err){
            res.send(500,err);
          } else {
            res.send(204);
          }
        });
      }
    };
  });
  return resources;
}

module.exports = function(app,options){
  options = options || {};
  if(!options.models) throw new Error('You must pass in models when setting up admin resources.');
  if(!options.db) throw new Error('You must pass in a DB when setting up admin resources.');
  if(!options.baseURL) throw new Error('You must provide a baseURL when setting up admin resources.');

  var models = options.models;
  var db = options.db;
  var baseURL = options.baseURL;

  // TODO: this setup is currently very mongo specific. May want to offload the resource methods to the db wrapper. We'll do this once we add our first additional db.
  var resources = setupResources(models,db);
  Object.keys(resources).forEach(function(name){
    var services = resources[name];
    services.base = baseURL;
    new Resource(name,services,app);
  });
}
