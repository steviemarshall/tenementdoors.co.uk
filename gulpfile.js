// Require Gulp
const gulp = require('gulp');

// Require Packages
const browserSync = require('browser-sync').create(),
      concat = require('gulp-concat'),
      //changed = require('gulp-changed'),
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

function compileHTML() {
  log('-> Moving HTML');
  return gulp.src([
    paths.src + '/*.{htm,html}'   
  ])
  //.pipe(changed('/*.{htm,html}'))
  .pipe(gulp.dest('./web'));
}

function styles() {
  log('-> Compiling SCSS');
  return gulp.src([
    paths.src + '/sass/frontend.scss' 
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
  //.pipe(concat('main.min.css'))
  .pipe(size({
    gzip: false,
    showFiles: true
  }))
  .pipe(sourcemaps.write('./maps'))
  .pipe(lec({
    verbose: true,
    eolc: 'LF',
    encoding:'utf8'
  }))
  .pipe(gulp.dest('./web/assets/css'))
  .pipe(browserSync.stream());
}

// function watch() {
//   gulp.watch([
//     paths.src + '/styles/**/*.scss', styles
//   ]);
// }

function watch() {
  log('-> Watching');
  browserSync.init({
    proxy: 'http://tenementdoors.local',
    injectChanges: true,
    //server: "./web"
  });
  gulp.watch(paths.src + '/sass/**/*.scss', styles);
}


const build = gulp.series(
        clean, 
        gulp.parallel(styles, compileHTML)
      );
      gulp.task('build', build); 




// Gulp Commands------------------

// Helper Task
exports.message = message;

// Build Tasks
exports.clean = clean;
exports.compileHTML = compileHTML;
exports.styles = styles;
exports.watch = watch;

exports.default = build;


