var gulp = require("gulp");
var babel = require("gulp-babel");
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var webserver = require('gulp-webserver');

gulp.task('serve', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
    }));
  gulp.watch('assets/js-src/main.js', ['babel-home']);
});

gulp.task('babel-home', function () {
  return gulp.src('assets/js-src/main.js')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(babel())
    .pipe(gulp.dest('assets/js'));
});

gulp.task('babel', function () {
  return gulp.src('src/bease.js')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task("watch", function () {
  gulp.watch('src/bease.js', ['babel']);
});

gulp.task('default', ['babel']);