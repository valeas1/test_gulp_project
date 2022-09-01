const { src, dest, parallel, series, watch } = require('gulp');
const browserSync  = require('browser-sync').create();
const      concat  = require('gulp-concat');
const      uglify  = require('gulp-uglify-es').default;
const        sass  = require('gulp-sass')(require('sass'));
const   sourcemap  = require('gulp-sourcemaps');
const     postcss  = require('gulp-postcss');
const autoprefixer = require("gulp-autoprefixer");
const          pug = require("gulp-pug");
const     prettier = require("gulp-pretty-html");
const          del = require("gulp-clean");
const     cleancss = require("gulp-clean-css");
const     htmlMin  = require("gulp-htmlmin");
const     imgMin   = require("gulp-imagemin");

function serv() {
    browserSync.init({
         server: { baseDir: 'app/' },
         notify: false,
         online: true
    })
}
function html () {
    return src('app/*.html')
    .pipe(browserSync.stream());
}
function pugdev () {
    return src('app/pug/*.pug')
    .pipe(pug({
        doctype: 'html'
    }))
    .pipe(prettier())
    .pipe(dest('app/'))
    .pipe(browserSync.stream())
}
function scripts () {
    return src(['app/js/*.js', '!app/js/all.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream())
}
function style () {
    return src('app/sass/**/*.+(scss|sass)')
    .pipe(sourcemap.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(sourcemap.write('.'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}
function clean () {
    return src('dist', {read: false})
    .pipe(del());
}
function mincss () {
    return src('app/css/main.css')
    .pipe(cleancss())
    .pipe(dest('dist/css'));
}
function jsprod () {
    return src('app/js/all.js')
    .pipe(dest('dist/js'));
}
function htmlmin () {
    return src('app/*.html')
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
}
function imgmini () {
    return src('app/img/**/*.{png,jpg,svg}')
    .pipe(imgMin())
    .pipe(dest('dist/img'))
}
function copydist () {
    return src('app/fonts/*.*')
    .pipe(dest('dist/fonts'))
}
function startwatch () {
    watch('app/sass/**/*.+(scss|sass)', style);
    watch([
        'app/**/*.js',
        '!app/js/all.js'
    ], scripts);
    watch('app/pug/**/*.pug', pugdev)
    watch('app/*.html', html);
}

exports.serv     = serv;
exports.scripts  = scripts;
exports.style    = style;
exports.pugdev   = pugdev;
exports.clean    = clean;
exports.mincss   = mincss;
exports.jsprod   = jsprod;
exports.htmlmin  = htmlmin;
exports.imgmini  = imgmini;
exports.copydist = copydist;

exports.default = parallel(html, pugdev, style, scripts, serv, startwatch);
exports.build = series(clean, mincss, jsprod, htmlmin, imgmini, copydist);
