var models = require('../../models');
var url = require('url');

var helpers = module.exports = {};

var currentCollection = helpers.currentCollection = function(){
  var match = url.parse(window.location.href).pathname.match(/\/admin\/([^\/]+)/);
  return match ? match[1] : null;
};

helpers.currentID = function(){
  var match = url.parse(window.location.href).pathname.match(/\/admin\/[^\/]+\/([^\/]+)/);
  return match ? match[1] : null;
};

helpers.currentModel = function(){
  var collection = currentCollection();
  var model = Object.keys(models).reduce(function(previous,name){
    var model = models[name];
    return (model.prototype.collection == collection) ? model : previous;
  },{});
  return model;
};

helpers.parseSchema = function(schema){
  var fields = [];
  Object.keys(schema).forEach(function(key){
    var keyInfo = schema[key];
    var info = {
      name : key,
      editable : keyInfo.editable !== false
    };
    switch(keyInfo.type){
      case Boolean:
        info.tag = 'input';
        info.type = 'checkbox';
        break;
      case Number:
        info.tag = 'input';
        info.type = 'number';
        break;
      case String:
      default:
        // TODO: recurse if deep?
        info.tag = keyInfo.text ? 'textarea' : 'input';
        info.type = keyInfo.secure ? 'password' : 'text';
        break;
    }
    fields.push(info);
  });
  return fields;
};
