const PATH = "./";

const gulp       = require("gulp"),
  sass         = require("gulp-sass"),
  // sassGlob  = require( 'gulp-sass-glob' ),
  concat  = require('gulp-concat');
 // sourcemaps   = require("gulp-sourcemaps"),
  autoprefixer = require("gulp-autoprefixer"),
  browserSync  = require('browser-sync').create(),
  reload       = browserSync.reload,
  plumber      = require("gulp-plumber"),
  htmlhint     = require("gulp-htmlhint"),
  eslint       = require("gulp-eslint"),
  notify       = require("gulp-notify"),
  ejs          = require("gulp-ejs"),
  data         = require('gulp-data'),
  rename       = require('gulp-rename'),
  changed      = require('gulp-changed'),
 // uglify       = require('gulp-uglify'),
  aigis        = require("gulp-aigis"),
  csscomb      = require('gulp-csscomb'),
  del          = require('del'),
  runSequence  = require('run-sequence'),
  cleancss     = require('gulp-clean-css'),
  fs           = require("fs"),
//  cmq          = require('gulp-combine-media-queries'),

  SRC          = PATH + "src/",
  DIST         = PATH + "dist/";

require("es6-promise").polyfill();

gulp.task('sass', function() {
  gulp.src(SRC + 'scss/**/*scss')
    // .pipe(sassGlob())
    .pipe(plumber())
    //.pipe(sourcemaps.init())
    .pipe(sass())
   // .pipe(sourcemaps.write('/'))
   // .pipe(cmq())
    .pipe(csscomb())
    .pipe(autoprefixer())
    .pipe(gulp.dest(DIST + 'css/'))
});


//html
gulp.task('html',function(){
    gulp.src(SRC + '**/*.html')
    .pipe(gulp.dest(DIST))
});

//js
gulp.task('jsmin',function(){
    gulp.src(SRC + 'js/*')      // coffeeディレクトリ以下全てのファイルを指定
    .pipe(plumber())            // エラーでwatchが止まらないように
    .pipe(concat('script.js')) // 一つのファイルに結合する
    //.pipe(uglify())             // 圧縮する
    .pipe(gulp.dest(SRC +'js/min'));  // jsディレクトリに書き出す
});

gulp.task('js', function() {
  gulp.src(SRC + 'js/min/*.js')
    .pipe(changed(DIST + 'js/'))
    .pipe(gulp.dest(DIST + 'js/'))
});

//public_htmlに書き出す
gulp.task('copy-src',function() {
  gulp.src([SRC + '**/*.+(jpg|jpeg|gif|png|svg|php|map|mp4|otf|ttf|woff|pdf|xlsx|zip|json)', SRC + 'layout/*.+(js|css)'])
    .pipe(changed(DIST))
    .pipe(gulp.dest(DIST))
});

//watchで自動で書きだす
gulp.task('default', function() {
    browserSync.init({
    server: { baseDir: DIST },
    port: 7878,
    directoryListing: true
  });
  gulp.watch(SRC + 'scss/**/*.scss', ['sass']).on('change', reload);
  gulp.watch(SRC + 'js/**/*.js', ['js']).on('change', reload);
  gulp.watch([SRC + 'js/**/*.js','!' + SRC + 'js/min/*.js'],['jsmin']).on('change', reload);
  //gulp.watch(SRC + '**/*.ejs', ['ejs']).on('change', reload);
  gulp.watch(SRC + '**/*.html', ['html']).on('change', reload);
  gulp.watch([SRC + '**/*.+(jpg|jpeg|gif|png|svg|php|map|mp4|otf|ttf|woff|pdf|xlsx|zip|json)', SRC + 'layout/*.+(js|css)', '!' + SRC + 'js/', '!' + SRC + 'css/'],['copy-src']).on('change', reload);
});

gulp.task("build-ejs", function() {
  gulp.src([SRC + '**/*.ejs','!' + SRC + 'inc/_*.ejs'])
  .pipe(ejs())
  .pipe(rename({extname: ".html"}))
  .pipe(gulp.dest(DIST))
});

gulp.task('build-sass', function() {
  gulp.src(SRC + 'scss/**/*scss')
    .pipe(sass())
    //.pipe(sourcemaps.write('/'))
    //.pipe(cmq())
    .pipe(csscomb())
    .pipe(autoprefixer())
    .pipe(gulp.dest(DIST + 'css/'))
});

gulp.task('build-js', function() {
  gulp.src(SRC + 'js/min/*.js')
    .pipe(gulp.dest(DIST + 'js/'))
});

gulp.task("build-copy", function() {
  gulp.src([SRC + '**/*.+(jpg|jpeg|gif|png|svg|php|map|mp4|otf|ttf|woff|pdf|xlsx|zip)'])
  .pipe(gulp.dest(DIST))
});

gulp.task('clean', function() {
  return del(DIST + '*');
});

gulp.task('build', function(done) {
  runSequence(
    'build-ejs',
    'build-sass',
    'build-js',
    'build-copy',
    done);
});

gulp.task('finish', function(done) {
  runSequence(
    'clean',
    'build-sass',
    'build-js',
    'build-copy',
    done);
});