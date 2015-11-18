var gulp = require("gulp");
var babel = require("gulp-babel");
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

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