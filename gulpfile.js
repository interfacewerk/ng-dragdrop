var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var format = require('gulp-clang-format');
var sequence = require('gulp-sequence');

var NG1_DIST_FILENAME = 'ng-dragdrop.js';

gulp.task('build-ng1-compile', function() {
  return gulp.src([
    'src/ng1/intro.js',
    'tmp/ng1-ts/ng-dragdrop.js',
    'src/ng1/outro.js'
  ])
  .pipe(concat(NG1_DIST_FILENAME))
  .pipe(gulp.dest('tmp/ng1-compile'));
});

gulp.task('build-ng1-format', function() {
  return gulp.src('tmp/ng1-compile/' + NG1_DIST_FILENAME)
  .pipe(format.format())
  .pipe(gulp.dest('dist/ng1'));
});

gulp.task('build-ng1-ts', function () {
  return gulp.src([
    'src/commons.ts',
    'src/ng1/**/*.ts',
    'typings/**/*.ts'
  ])
  .pipe(ts({
    noImplicitAny: false,
    out: NG1_DIST_FILENAME
  }))
  .pipe(gulp.dest('tmp/ng1-ts'));
});

gulp.task('build-ng1', sequence(['build-ng1-ts', 'build-ng1-compile', 'build-ng1-format']));

gulp.task('build', ['build-ng1'], function() {
});
