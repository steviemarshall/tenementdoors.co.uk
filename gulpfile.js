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
  src: './src'
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
  //.pipe(changed('/*.{htm,html}'))
  .pipe(gulp.dest('./web'));
}

function styles() {
  log('-> Compiling SCSS');
  return gulp.src([
    paths.src + '/scss/frontend.scss' 
  ])
  .pipe(sass({
    erroLogToConsole: true,
    // outputStyle: 'compressed'
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

function watch() {
  log('-> Watching');
  browserSync.init({
    injectChanges: true,
    server: "./web"
  });
  gulp.watch(paths.src + '/scss/**/*.scss', styles);
  // gulp.watch(paths.src + '/src/*.{htm,html}', html);
  
}

// function reload(done) {
//   server.reload();
//   done();
// }

// function serve(done) {
//   server.init({
//     server: {
//       baseDir: './web'
//     }
//   });
//   done();
// }



// const start = gulp.series(watch,styles,html);
// gulp.task('start', start);

//const watch = () => gulp.watch(paths.src + '/src/scss/**/*.scss', gulp.series(styles, reload));

//const dev = gulp.series(styles, serve, watch);
//export default dev;

// Gulp Commands------------------

// Helper Task
exports.message = message;

// Build Tasks
exports.clean = clean;
exports.styles = styles;
exports.html = html;
exports.watch = watch;
// exports.start = start;

// exports.serve = serve;
// exports.reload = reload;

// exports.dev = dev;
