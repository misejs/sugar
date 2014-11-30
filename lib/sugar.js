var path = require('path');
var admin = require('../routes/admin');
var setupResources = require('../routes/resources');
var mongodb = require('./db/mongo');
var url = require('url');
var express = require('express');
var client = require('../public/admin/javascripts/viewModels');

var sugar = {};

var _models = {};
var addResourceMethods = require('./addResourceMethods');

sugar.Model = require('./Model');

sugar.models = function(baseURL){
  return decorateModels(_models,baseURL);
}

sugar.add = function(name,model){
  _models[name] = model;
}

// Configure an express app to work with our admin.
sugar.setup = function(app,models){
  // add the current URL to the response locals
  app.use(function(req,res,next){
    res.locals.url = url.format(url.parse('http' + (req.connection.secure ? 's' : '') + '://' + req.headers.host + req.url));
    res.locals.headers = req.headers;
    res.locals.models = models;
    res.locals.js = res.locals.js || [];
    res.locals.js.push(client);
    next();
  });

  // serve up the js we'll need for our admin routes
  app.use('/public/admin',express.static(path.join(__dirname, '../public/admin')));

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

  app.get('/admin',admin.home);
  Object.keys(models).forEach(function(name){
    var Model = models[name];
    var collection = Model.prototype.collection;
    app.get('/admin/' + collection, admin.index);
    app.get('/admin/' + collection + '/create', admin.create);
    app.get('/admin/' + collection + '/:id', admin.update);
  });

  setupResources(app,{
    models : models,
    baseURL : '/admin/api/',
    db : mongodb
  });
}

module.exports = sugar;
