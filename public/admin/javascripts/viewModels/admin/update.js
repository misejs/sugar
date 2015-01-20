module.exports = function(helpers){
  function UpdateItemAdminViewModel(ready) {
    var Model = helpers.currentModel();
    var self = this;
    self.model = new Model();
    self.fields = helpers.parseSchema(self.model.schema);
    Model.show(helpers.currentID(),function(info){
      self.model = new Model(info);
      self.fields.forEach(function(field){
        field.value = self.model[field.name];
      });
    },function(err){
      console.error(err);
    },ready);
    self.save = function(){
      self.model = helpers.modelFromFields(Model,self.fields);
      self.model.save(function(saved){
        self.model = new Model(saved);
      },function(){
        console.error(arguments);
      });
    };
  };
  return UpdateItemAdminViewModel;
}
