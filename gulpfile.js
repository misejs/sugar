// Build for our client - adds a 'build' command to our grunt commands that browserifies our client.
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var inject = require("gulp-inject");
var concat = require('gulp-concat');

// Inject scripts
gulp.task('injectScripts', ['browserify'], function () {
  var target = gulp.src('./views/admin/nav.html');
  var sources = gulp.src(['./public/admin/build/js/main.js', './public/build/**/*.css'], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./views/admin'));
});

// Browserify - concatenates the browserify files and dumps them in app.js
gulp.task('browserify', function() {
  var target = gulp.src(['./public/admin/javascripts/main.js'])
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    // Bundle to a single file
    .pipe(concat('main.js'))
    // Output it to our dist folder
    .pipe(gulp.dest('./public/admin/build/js'));
  return target;
});

gulp.task('build-client',['browserify','injectScripts']);
