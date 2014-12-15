module.exports = function(helpers){
  function AdminViewModel() {
    var models = helpers.models;
    this.models = Object.keys(models).map(function(model){
      name = models[model].prototype.collection;
      return {
        name : name,
        link : '/admin/' + name
      };
    });
  };
  return AdminViewModel;
};
