// Require Gulp
const gulp = require('gulp');

// Require Packages


function message(done) {
    console.log('Awooga');
    done();
}

// gulp.task('message', function(done) {
//     console.log('Awooga');
//     done();
// })

// Gulp Commands------------------

// Helper Task
exports.message = message;

