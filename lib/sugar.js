var path = require('path');
var fs = require('fs');
var admin = require('../routes/admin');
var setupResources = require('../routes/resources');
var mongodb = require('./db/mongo');
var url = require('url');
var express = require('express');
var clientPath = '../public/admin/javascripts/viewModels';
var client = require(clientPath);
var layout = require('express-layout');
var browserify = require('browserify');
var async = require('async');

var sugar = {};

var _models = {};

sugar.models = function(baseURL){
  return decorateModels(_models,baseURL);
}

sugar.add = function(name,model){
  _models[name] = model;
}

var bundleClientFile = function(modelPath,bundlePath,name,callback){
  if(typeof name == 'function'){
    callback = name;
    name = false;
  }
  var b = browserify(modelPath,{
    debug : (process.env['NODE_ENV'] == 'development'),
    builtins : {}
  });
  b.require(modelPath,{ expose : name });
  var bundleFile = fs.createWriteStream(path.normalize(bundlePath));
  var bundle = b.bundle();
  bundle.pipe(bundleFile);
  var done = false;
  bundle.on('error',function(err){
    console.error('error bundling file : ',err);
    done = true;
    if(callback) callback(err);
  });
  bundle.on('end',function(res){
    if(!done && callback) callback(null,res);
  });
}

// Configure an express app to work with our admin.
sugar.setup = function(app,modelPath,options,done){
  var models = require(modelPath);
  // add the current URL to the response locals
  app.use(function(req,res,next){
    res.locals.url = url.format(url.parse('http' + (req.connection.secure ? 's' : '') + '://' + req.headers.host + req.url));
    res.locals.headers = req.headers;
    res.locals.models = models;
    res.locals.js = res.locals.js || [];
    res.locals.js.push(client);
    next();
  });

  var staticPath = path.join(__dirname, '../public/admin');
  bundleClientFile(modelPath,path.join(staticPath,'build/js/models.js'),'models',done);

  // serve up the js we'll need for our admin routes
  app.use('/public/admin',express.static(staticPath));

  // add our admin views to the views lookup
  var views = app.get('views');
  var adminViews = path.normalize(path.join(__dirname,'../views'));
  if(!Array.isArray(views)){
    views = [views];
  }
  if(!~views.indexOf(adminViews)){
    views.push(adminViews);
    app.set('views',views);
  }

  // middleware for adding express layouts if necessary
  app.use(function(req,res,next){
    var haslayout = app.get('layout');
    if(haslayout || haslayout === false){
      next();
    } else {
      layout(req,res,next);
    }
  });

  app.get('/admin',admin.home);
  Object.keys(models).forEach(function(name){
    var Model = models[name];
    var collection = Model.prototype.collection;
    app.get('/admin/' + collection, admin.index);
    app.get('/admin/' + collection + '/create', admin.create);
    app.get('/admin/' + collection + '/:id', admin.update);
  });

  // TODO: validate the db config.
  var dbconfig = options.dbconfig;

  setupResources(app,{
    models : models,
    baseURL : '/api/',
    db : mongodb(dbconfig,models)
  });
}

module.exports = sugar;
