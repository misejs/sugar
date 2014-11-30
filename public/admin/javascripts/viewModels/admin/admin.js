module.exports = function(helpers){
  function AdminViewModel() {
    var models = helpers.models;
    var modelNames = Object.keys(models).map(function(name){
      return models[name].prototype.collection;
    });
    this.models = [];
  };
  return AdminViewModel;
};
