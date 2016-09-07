var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('scripts', function() {
  gulp.src(['./src/**/*.js'])
    .pipe(concat('jquery_external_link_checker.js'))
    .pipe(gulp.dest('dist'))
});

gulp.task('scripts-min', function() {
  gulp.src(['./dist/jquery_external_link_checker.js'])
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('default', function() {
  gulp.start('build');
});

gulp.task('build', ['scripts'], function() {
  gulp.start('scripts-min');
});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**', function(event) {
    gulp.start('build');
  });
});
