const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const sourceMaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const fileinclude = require('gulp-file-include');

gulp.task('compressJs', function(){
  return gulp.src('./src/js/app.js')
    .pipe(terser())
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.reload({stream: true}));
})


gulp.task('sass', function() {
    return gulp.src('src/scss/app.scss')
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourceMaps.write())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/styles'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function() {
    return gulp.src('*.html')
    .pipe(fileinclude())
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('serve', gulp.series('html', 'compressJs', 'sass', function(){
    browserSync.init({
        server: "build"
    });
    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('src/js/**/*.js', gulp.parallel('compressJs'));
    gulp.watch('*.html', gulp.parallel('html'));
    gulp.watch('partials/**/*.html', gulp.parallel('html'));
}));