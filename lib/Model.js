var pluralize = require('pluralize');

function Model(){};

var undef = function(val){
  return typeof val === 'undefined' || val === null;
};

var falsey = function(val){
  switch(typeof val){
    case 'string':
      return val != 'false' && val != '';
      break;
    default:
      return !!val;
      break;
  }
};

var setProperties = function(schema,model,defaults){
  Object.keys(schema || {}).forEach(function(name){
    var property = schema[name];
    if(!(typeof property === 'object')){
      throw new Error('Tried to initialize non-object property for model ' + (model && model.constructor.prototype.name) + '.' + name);
    }
    if(property.type){
      var getter = function(){
        if(property.get){
          return property.get.call(this);
        } else {
          return defaults[name];
        }
      }
      var setter = function(val){
        if(!undef(val) && property.type !== 'Any' && val.constructor !== property.type){
          switch(property.type){
            case Boolean:
              val = falsey(val);
              break;
            case Number:
              val = parseFloat(val,10);
              break;
            case String:
            default:
              val = val.toString();
              break;
          }
        }
        // on the client, map this to a ko observable if not explicitly set to non-observable.
        if(typeof ko !== 'undefined' && property.observable !== false){
          val = Array.isArray(val) ? ko.observableArray(val) : ko.observable(val);
        }
        if(property.set){
          property.set.call(this,val);
        } else {
          defaults[name] = val;
        }
      }

      Object.defineProperty(model,name,{
        get : getter,
        set : setter,
        enumerable : true,
        configurable : true
      });
      // define the default value if it exists
      if(defaults[name]){
        model[name] = defaults[name];
      }
    } else {
      model[name] = setProperties(schema[name],model[name],defaults[name]);
    }
  });
  return model;
};

var toObject = function(){
  var model = this;
  var object = Object.keys(model).reduce(function(o,key){
    var val = model[key];
    if(typeof val != 'undefined' && val !== ''){
      o[key] = (typeof val == 'function') ? val() : val;
    }
    return o;
  },{});
  return object;
}

module.exports = function(name,schema,collection){
  var SubModel = function(object){
    var sub = Model.call(this);
    var values = object || {};
    setProperties(schema,this,values);
    return sub;
  };
  SubModel.prototype = Object.create(Model.prototype);
  SubModel.prototype.constructor = SubModel;
  SubModel.prototype.constructor.prototype.name = name;
  SubModel.prototype.schema = schema;
  SubModel.prototype.collection = collection || pluralize(name).toLowerCase();
  SubModel.prototype.toObject = toObject;
  return SubModel;
};
