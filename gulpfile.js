// Require Gulp
const gulp = require('gulp');

// Require Packages
const concat = require('gulp-concat'),
      cssnano = require('gulp-cssnano'),
      del = require('del'),
      lec = require('gulp-line-ending-corrector'),
      log = require('fancy-log'),
      sass = require('gulp-sass'),
      size = require('gulp-size'),
      sourcemaps = require('gulp-sourcemaps');

// Setup paths for dependencies
const paths = {
  src: './src'
}


function message(done) {
  console.log('Awooga');
  done();
}

function clean() {
  return del(["./web/assets/"]);
}

function styles() {
  log('-> Compiling SCSS');
  return gulp.src([
    paths.src + '/styles/frontend.scss' 
  ])
  .pipe(sass({
    erroLogToConsole: true,
    outputStyle: 'compressed'
  }))
  .on('error', sass.logError)
  .pipe(cssnano({
    discardComments: {
      removeAll: false
    },
    discardDuplicates: true,
    discardEmpty: true,
    minifyFontValues: true,
    minifySelectors: true
  }))
  .pipe(concat('main.min.css'))
  .pipe(size({
    gzip: true,
    showFiles: true
  }))
  .pipe(sourcemaps.write('./maps'))
  .pipe(lec({
    verbose: true,
    eolc: 'LF',
    encoding:'utf8'
  }))
  .pipe(gulp.dest('./web/assets/css'))
}

// Gulp Commands------------------

// Helper Task
exports.message = message;
exports.clean = clean;
exports.styles = styles;

