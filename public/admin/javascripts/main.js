var runViewModels = require('./viewmodels');
var jquery = require('jquery-browserify');

runViewModels.call({
  url : window.url,
  models : window.mise.models
},jquery);
