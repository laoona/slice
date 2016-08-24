var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-dest-clean');

var watchDir = './src/**/*';
var buildDir = './build';
var scssDir = './src/scss/**/*.scss';

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./src/",
        watchOptions: {
            ignoreInitial: true,
            ignored: ['**/*.map', '**/*.psd', '**/.maps/', '**/*.*.map']
        }
    });

    browserSync.watch(scssDir).on('change', function(dir) {
        gulp.src(dir)
            .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
            .pipe(sourcemaps.write('./.maps'))
            .pipe(gulp.dest("./src/css"));
    });

    browserSync.watch(watchDir).on('change', function(dir) {
        if (dir.indexOf('.scss') > -1) return;

        browserSync.reload()
    });
    browserSync.watch(watchDir).on('unlink', browserSync.reload);
});


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(scssDir)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./.maps'))
        .pipe(gulp.dest("./src/css"))
        .pipe(browserSync.stream());
});

// clean
gulp.task('clean', function () {
    return gulp.src(buildDir, {read: false})
        .pipe(clean(buildDir));
});

// build 
gulp.task('build', ['sass', 'clean'], function () {
    gulp.src('./src/**/*.html')
    .pipe(gulp.dest(buildDir));

    gulp.src('./src/css/**/*.css')
    .pipe(gulp.dest(buildDir + '/css'));

    gulp.src('./src/fonts')
    .pipe(gulp.dest(buildDir));

    gulp.src('./src/js')
    .pipe(gulp.dest(buildDir));

    gulp.src('./src/images')
    .pipe(gulp.dest(buildDir));
});

gulp.task('default', ['serve']);
