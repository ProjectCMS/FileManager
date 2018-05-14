var gulp        = require('gulp'),
    typescript  = require('gulp-typescript'),
    autoprefix  = require("gulp-autoprefixer"),
    sass        = require('gulp-sass'),
    connect     = require("gulp-connect"),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    jshint      = require('gulp-jshint'),
    clean       = require('gulp-clean'),
    cleancss    = require('gulp-clean-css'),
    runSequence = require('run-sequence'),
    watch       = require('gulp-watch'),
    imagemin    = require('gulp-imagemin'),
    extender    = require('gulp-html-extend'),
    jsjson      = require('./json/js.json'),
    cssjson     = require('./json/css.json'),
    fontsjson   = require('./json/fonts.json');

// ** Pastas de arquivos **//
var jsfiles     = [
        'src/js/*.js',
        'src/js/**/*.js'],
    tsfiles     = [
        'src/ts/*.ts',
        'src/ts/**/*.ts'],
    cssfiles    = [
        'src/css/*.css',
        'src/css/**/*.css'],
    scssfiles   = [
        'src/scss/*.scss',
        'src/scss/**/*.scss'],
    imagesfiles = [
        'src/images/*',
        'src/images/**/*',
        'src/images/**/**/*'],
    htmlfiles   = [
        'src/html/**/*.html',
        'src/html/**/**/*.html'];


var tsProject = typescript.createProject('tsconfig.json', {noImplicitAny: true});

// ** Limpa todos os arquivos **//
gulp.task('clean', function () {
    return gulp.src('build').pipe(clean());
});
gulp.task('cleancss', function () {
    return gulp.src('build/css').pipe(clean());
});
gulp.task('cleanjs', function () {
    return gulp.src('build/js').pipe(clean());
});
gulp.task('cleanimages', function () {
    return gulp.src('build/images').pipe(clean());
});

// ** Verifica se existe erros nos arquivos JS **//
gulp.task('jshint', function () {
    return gulp.src('src/js/*.js').pipe(jshint()).pipe(jshint.reporter('default'));
});

// ** Minifica os arquivos ts **//
gulp.task('typescript', ['jshint', 'cleanjs'], function () {
    return gulp.src(tsfiles).pipe(tsProject()).pipe(gulp.dest('src/js'));
});

// ** Minifica os arquivos js **//
gulp.task('uglify', function () {

    var files = Object.keys(jsjson).map(function (k) {
        return jsjson[k]
    });

    return [
        gulp.src(files).pipe(concat('libs.min.js')).pipe(uglify()).pipe(gulp.dest('build/js')).pipe(connect.reload()),
        gulp.src(jsfiles).pipe(concat('core.min.js')).pipe(uglify()).pipe(gulp.dest('build/js')).pipe(connect.reload())

    ];
});

// ** Compila os arquivos css **//
gulp.task('sass', function () {
    return gulp.src(['src/scss/*.scss']).pipe(sass(
        {
            sourcemaps: true,
        })).pipe(autoprefix("last 2 versions")).pipe(gulp.dest('src/css'));
});

// ** Minifica os arquivos css **//
gulp.task('cssmin', ['sass'], function () {

    var files = Object.keys(cssjson).map(function (k) {
        return cssjson[k]
    });

    return [
        gulp.src(files).pipe(concat('libs.min.css')).pipe(cleancss()).pipe(gulp.dest('build/css')).pipe(connect.reload()),
        gulp.src(cssfiles).pipe(concat('core.min.css')).pipe(cleancss()).pipe(gulp.dest('build/css')).pipe(connect.reload())
    ];
});

// ** Compacta as imagens **//
gulp.task('imagemin', ['cleanimages'], function () {
    return gulp.src(imagesfiles).pipe(imagemin()).pipe(gulp.dest('build/images')).pipe(connect.reload());
});

// ** Extende os arquivos html **//
gulp.task('extend', function () {
    return gulp.src(htmlfiles).pipe(extender({annotations: true, verbose: false})).pipe(gulp.dest('build/html')).pipe(connect.reload());
});

// ** Copia os arquivos de fonts **//
gulp.task('fonts', function () {

    var files = Object.keys(fontsjson).map(function (k) {
        return fontsjson[k]
    });

    return gulp.src(files).pipe(gulp.dest('build/fonts'))
});

// ** Fica escutando os arquivos **//
gulp.task('watch', function () {
    return [
        gulp.watch(jsfiles, ['uglify']),
        gulp.watch(scssfiles, ['cssmin']),
        gulp.watch(imagesfiles, ['imagemin']),
        gulp.watch(htmlfiles, ['extend']),
    ]
});

// ** Conexão local **//
gulp.task("connect", function () {
    connect.server(
        {
            port: 9000,
            livereload: true
        });
});

gulp.task('default', function (callback) {
    return runSequence('connect', ['watch'], callback)
});

gulp.task('full', function (callback) {
    return runSequence('clean', ['uglify', 'cssmin', 'imagemin', 'fonts'], callback)
});

