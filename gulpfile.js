const gulp = require('gulp');

const gConcat = require('gulp-concat');
const gTrim = require('gulp-trim');
const gHeader = require('gulp-header');
const gSass = require('gulp-dart-sass');
const gAutoPrefixer = require('gulp-autoprefixer');

const updateJSON = require('update-json-file');

// Set Package Information
const version = '1.0.9';

// Build style
const buildSass = () => gulp.src([
  './src/portal/wrap.scss',
  './src/login/wrap.scss',
]).pipe(gSass({ outputStyle: 'compressed' }))
  .pipe(gAutoPrefixer())
  .pipe(gConcat('POSTECH-SSO-Dark.user.css'))
  .pipe(gHeader(`

/* ==UserStyle==
@name         POSTECH Dark SSO
@namespace    gist.github.com/wldh-g/0f63065237bc5831df10ae17fe96d2b4
@homepageURL  https://github.com/wldh-g/postech-sso-dark
@version      ${version}
@license      Other
@description  This enables dark theme of POVIS SSO login page.
@author       Jio Gim (https://github.com/wldh-g/)
@preprocessor default
==/UserStyle== */

`)).pipe(gTrim())
   .pipe(gulp.dest('./'));

// Build once
const build = (resolve) => {
  try {
    buildSass();
    updateJSON('./package.json', (pkg) => {
      pkg.version = version;
      return pkg;
    });
  } catch (e) { console.error(e); } finally { resolve(); }
};

// Watch for changes (Hot-build)
const watch = () => {
  try {
    gulp.watch([
      './src/*.scss',
      './src/login/*.scss',
      './src/portal/*.scss',
      './src/partial/*.scss',
    ], {}, buildSass);
  } catch (e) { console.debug(e); }
};

// Accessible tasks
gulp.task('build', gulp.parallel(build));
gulp.task('watch', gulp.series('build', watch));
gulp.task('default', gulp.parallel('watch'));
