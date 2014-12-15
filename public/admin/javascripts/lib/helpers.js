var url = require('url');
var addResourceMethods = require('./addResourceMethods');

var helpers = module.exports = {};

helpers.currentCollection = function(){
  var match = url.parse(this.url).pathname.match(/\/admin\/([^\/]+)/);
  return match ? match[1] : null;
};

helpers.currentID = function(){
  var match = url.parse(this.url).pathname.match(/\/admin\/[^\/]+\/([^\/]+)/);
  return match ? match[1] : null;
};

helpers.currentModel = function(){
  var collection = this.currentCollection();
  var models = this.models;
  var model = Object.keys(models).reduce(function(previous,name){
    var model = models[name];
    return (model.prototype.collection == collection) ? model : previous;
  },{});
  return addResourceMethods(model,this.url);
};

helpers.parseSchema = function(schema){
  var fields = [];
  Object.keys(schema).forEach(function(key){
    var keyInfo = schema[key];
    var info = {
      name : key,
      disabled : keyInfo.editable === false
    };
    switch(keyInfo.type){
      case Boolean:
        info.textInput = false;
        info.checkbox = true;
        break;
      case Number:
        info.textInput = true;
        info.type = 'number';
        break;
      case String:
      default:
        info.textInput = !keyInfo.text;
        info.textArea = keyInfo.text;
        info.secure = keyInfo.secure;
        // TODO: recurse if deep?
        info.tag = keyInfo.text ? 'textarea' : 'input';
        info.type = keyInfo.secure ? 'password' : 'text';
        break;
    }
    fields.push(info);
  });
  return fields;
};
