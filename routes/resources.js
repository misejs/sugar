var Resource = require('express-resource');

var verbose = true;
var log = function(){
  if(verbose) return console.log.apply(console,arguments);
};

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
    var itemName = key.toLowerCase();
    var name = Model.prototype.collection;
    var collection = db[name];
    resources[name] = {};
    resources[name].index = function(req,res){
      log('getting all ',name);
      collection.findArray({},function(err,arr,result){
        log('got',err,arr,result);
        if(err){
          res.status(500).json({error : err.message});
        } else {
          var o = {};
          o[name] = arr;
          res.json(o);
        }
      });
    };
    resources[name].create = function(req,res){
      log('creating new',name);
      var newResource = new Model(req.body);
      log(newResource.toObject());
      collection.insert(newResource.toObject(),function(err,result){
        log('got',err,result);
        if (err) {
          res.status(500).json({error : err.message});
        } else {
          res.json(result[0]);
        }
      });
    }
    resources[name].show = function(req,res){
      log('finding',req.params[itemName],'from',name);
      collection.findById(req.params[itemName],function(err,item,result){
        log('got',err,item,result);
        if(err){
          res.status(500).json({error : err.message});
        } else {
          res.json(item);
        }
      });
    };
    resources[name].update = function(req,res){
      var id = parseId(req.params[itemName]);
      log('updating',id,'from',name);
      if(!id){
        res.status(406).json({error : "invalid id"});
      } else {
        // don't allow update on id
        delete req.body._id;
        var info = new Model(req.body);
        log('setting',info.toObject());
        collection.findAndModifyById(id,null,{$set:info.toObject()},{new:true},function(err,item,result){
          log('got',err,item,result);
          if(!err && !item){
            res.status(404).json({error : 'Item not found'});
          } else if(err){
            res.status(500).json({error : err.message});
          } else {
            res.json(item);
          }
        });
      }
    };
    resources[name].destroy = function(req,res){
      var id = parseId(req.params[key.toLowerCase()]);
      if(!id){
        res.status(406).json('{"error" : "invalid id"}');
      } else {
        log('removing',id,'from',name);
        collection.remove({_id : id},function(err,result){
          log('got',err,result);
          if(err){
            res.status(500).json({error : err.message});
          } else {
            res.sendStatus(204);
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

  // TODO: this setup is currently very mongo specific. May want to offload the resource methods to the db wrapper. We'll do this once we add our first additional db.
  var models = options.models;
  var db = options.db;
  var baseURL = options.baseURL;

  var resources = setupResources(models,db);
  Object.keys(resources).forEach(function(name){
    var services = resources[name];
    services.base = baseURL;
    new Resource(name,services,app);
  });
}
