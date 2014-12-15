var runViewModels = require('./viewmodels');
var jquery = require('jquery-browserify');

runViewModels.call({
  url : window.location.href,
  models : require('models')
},jquery);
