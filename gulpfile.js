// Require Gulp
const gulp = require('gulp');

// // Require Packages
const browserSync = require('browser-sync').create(),
      concat = require('gulp-concat'),
      cssnano = require('gulp-cssnano'),
      del = require('del'),
      lec = require('gulp-line-ending-corrector'),
      log = require('fancy-log'),
      sass = require('gulp-sass'),
      size = require('gulp-size'),
      sourcemaps = require('gulp-sourcemaps');

// Setup paths for dependencies
const paths = {
  src: './src',
  node: './node_modules'
}

function message(done) {
  console.log('Awooga');
  done();
}

function clean() {
  return del(["./web/assets/"]);
}

function html() {
  log('-> Moving HTML');
  return gulp.src([
    paths.src + '/*.{htm,html}'   
  ])
  .pipe(gulp.dest('./web'));
}

function installPackages() {
  log('-> Installing uikit');
  return gulp.src([
    paths.node + '/uikit/src/scss/**/*.scss'
  ])
    .pipe(gulp.dest('./src/scss/uikit'));
}

function styles() {
  log('-> Compiling SCSS');
  return gulp.src([
    paths.src + '/scss/app.scss',
    paths.src + '/scss/frontend.scss' 
  ])
  .pipe(sass({
    erroLogToConsole: true,
    // outputStyle: 'compressed'
    allowEmpty: true,
  }))
  .on('error', sass.logError)
  // .pipe(cssnano({
  //   discardComments: {
  //     removeAll: false
  //   },
  //   discardDuplicates: true,
  //   discardEmpty: true,
  //   minifyFontValues: true,
  //   minifySelectors: true
  // }))
  .pipe(concat('main.css'))
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

function scripts() {
  log('-> Moving Scripts');
  return gulp.src([
    paths.src + '/js/*.js'   
  ])
  .pipe(gulp.dest('./web/assets/js/'));
}


function watch() {
  log('-> Watching');
  browserSync.init({
    injectChanges: true,
    server: "./web"
  });
  gulp.watch(paths.src + '/scss/**/*.scss', styles);
  gulp.watch(paths.src + '/*.html', html).on('change', browserSync.reload);
  gulp.watch(paths.src + '/js/*.js', scripts).on('change', browserSync.reload);
  // gulp.watch('./web/*.html').on('change', browserSync.reload);
}

//const dev = gulp.series(styles, serve, watch);
//export default dev;


const serve = gulp.series(styles, html, scripts, watch);

// Gulp Commands------------------
// Helper Task
exports.message = message;

// Build Tasks
exports.clean = clean;
exports.installPackages = installPackages;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.watch = watch;

exports.serve = serve; 
