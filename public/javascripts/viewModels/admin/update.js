var helpers = require('./helpers');

function UpdateItemAdminViewModel(ready) {
  var Model = helpers.currentModel();
  var self = this;
  var newModel = new Model();
  self.model = ko.observable(newModel);
  self.fields = helpers.parseSchema(newModel.schema);
  Model.show(helpers.currentID(),function(info){
    self.model(new Model(info));
  },function(err){
    console.error(err);
  },ready);
  self.save = function(){
    self.model().save(function(saved){
      self.model(new Model(saved));
    },function(){
      console.error(arguments);
    });
  };
};

module.exports = UpdateItemAdminViewModel;
