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
  gulp.src(['./dist/**/jquery_external_link_checker.js'])
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('build', ['default'], function() {});

gulp.task('default', ['scripts', 'scripts-min'], function() {});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**', function(event) {
    gulp.run('build');
  });
});
