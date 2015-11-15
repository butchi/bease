var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task('watch', function(){
    gulp.watch('src/bease.js', ['babel']);
});

gulp.task("babel", function () {
  return gulp.src("src/bease.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task("default", ['babel']);
