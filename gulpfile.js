var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-dest-clean');
var tpl = require('gulp-file-include');
var gutil = require('gulp-util');
var del = require('del');

var buildDir = './build';
var scssDir = './src/scss/**/*.scss';
var tplDir = './src/source_pages/**/*.html';

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'tpl'], function() {

    browserSync.init({
        server: {
            baseDir: 'src'
            ,index: 'view/index.html' 
            ,directory: true
        },
        watchOptions: {
            ignoreInitial: true,
            ignored: ['**/*.map', '**/*.psd', '**/.maps/', '**/*.*.map']
        }
    });

    browserSync.watch(tplDir).on('change', function() {
        gulp.start(['tpl-watch']);
    });
    
    browserSync.watch(tplDir).on('unlink', function(dir) {
        
        del(['src/view/**/*']).then(function () {
            gulp.start(['tpl-watch']);
        });
    });

    browserSync.watch(scssDir).on('change', function() {
        gulp.start(['sass-watch']);
    });

    browserSync.watch(scssDir).on('unlink', function() {

        del(['src/css/**/*']).then(function () {
            gulp.start(['sass-watch']);
        });
    });
});

gulp.task('sass-watch', ['sass'], function (done) {
    browserSync.reload();  
    done();
});

gulp.task('tpl-watch', ['tpl'], function (done) {
    browserSync.reload();
    done();
});


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(scssDir)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./.maps'))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

//compile tpl to html
gulp.task('tpl', function () {
    return gulp.src(tplDir)
        .pipe(tpl({
            prefix: '@@',
            basepath: '@file'
        }))
        .on('error', function (error) {
            gutil.log(gutil.colors.magenta('ERROR: '), error.message);
            this.end();
        })
        .pipe(gulp.dest("src/view"))
        .pipe(browserSync.stream());
});

gulp.task('css', ['sass'], function () {
    return gulp.src('./src/css/**/*.css')
        .pipe(gulp.dest(buildDir + '/css'));
});

gulp.task('fonts', function () {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest(buildDir + '/fonts'));
});

gulp.task('js', function () {
    return gulp.src('./src/js/**/*')
        .pipe(gulp.dest(buildDir + '/js'));
});

gulp.task('images', function () {
    gulp.src('./src/images/**/*')
        .pipe(gulp.dest(buildDir + '/images'));
});

// clean
gulp.task('clean', function () {
    return gulp.src(buildDir, {read: false})
        .pipe(clean(buildDir));
});

// build 
gulp.task('build', ['clean'], function () {
    gulp.start(['tpl', 'css', 'fonts', 'js', 'images']);
    return gulp.src('src/view/*.html', ['tpl'])
    .pipe(gulp.dest(buildDir + '/pages'));
});

gulp.task('default', ['serve']);
