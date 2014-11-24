var helpers = require('./helpers');

function CreateItemAdminViewModel(ready) {
  var Model = helpers.currentModel();
  var self = this;
  var newModel = new Model();
  self.model = ko.observable(newModel);
  self.fields = helpers.parseSchema(newModel.schema);
  self.save = function(){
    self.model().save(function(saved){
      self.model(new Model(saved));
      window.location = '/admin/' + Model.prototype.collection + '/' + saved._id();
    },function(){
      console.error(arguments);
    });
  };
  ready();
};

module.exports = CreateItemAdminViewModel;
