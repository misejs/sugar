module.exports = function(helpers){
  function CreateItemAdminViewModel() {
    var Model = helpers.currentModel();
    var self = this;
    self.model = new Model();
    self.fields = helpers.parseSchema(self.model.schema);
    self.save = function(){
      self.model = helpers.modelFromFields(Model,self.fields);
      self.model.save(function(saved){
        self.model = new Model(saved);
        window.location = '/admin/' + Model.prototype.collection + '/' + saved._id;
      },function(){
        console.error('error saving :',arguments);
      });
    };
  };
  return CreateItemAdminViewModel;
}
