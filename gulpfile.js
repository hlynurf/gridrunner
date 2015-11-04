var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(['./*.html', './*.js']).on('change', browserSync.reload);
  gulp.watch(['./scss/**/*.scss'], ['sass']);
});


gulp.task('default', ['serve']);