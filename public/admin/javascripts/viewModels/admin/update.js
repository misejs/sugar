module.exports = function(helpers){
  function UpdateItemAdminViewModel(ready) {
    var Model = helpers.currentModel();
    var self = this;
    self.model = new Model();
    self.fields = helpers.parseSchema(self.model.schema);
    Model.show(helpers.currentID(),function(info){
      self.model = new Model(info);
      self.fields = self.fields.map(function(field){
        field.value = self.model[field.name];
        return field;
      });
    },function(err){
      console.error(err);
    },ready);
    self.save = function(){
      self.fields.forEach(function(field){
        self.model[field.name] = field.value;
      });
      self.model.save(function(saved){
        self.model = new Model(saved);
      },function(){
        console.error(arguments);
      });
    };
  };
  return UpdateItemAdminViewModel;
}
