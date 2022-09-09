const {src, dest, watch, parallel,series} = require('gulp')
const scss = require('gulp-sass')(require('sass'))
const htmlmin = require('gulp-htmlmin')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const minify = require('gulp-minify')
const uglify = require('gulp-uglify-es').default
const autoprefixer = require('gulp-autoprefixer')
const fileinclude = require('gulp-file-include')
const ejshtml = require("gulp-ejs")


function deleteDist(){
    return deleteAsync('/dist')
}

function browsersync(){

    browserSync.init({
        server:{
            baseDir:"./dist"
        } 
    })
}

function html(){

    return src('src/**.html')
        .pipe( fileinclude({
            prefix:'@'
        }) )
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

function scripts(){

    return src([
        'node_modules/jquery/dist/jquery.js',
        'src/js/**.js'
    ])  
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js')) 
        .pipe(browserSync.stream())
}

function styles(){

    return src('src/scss/**.scss')
        .pipe(scss({outputStyle:"compressed"}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserList: ['last 10 version'], 
            grid: true
        }))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream())
}

function images(){

    return src('src/images/**') 
        .pipe(dest('dist/images'))
}

function ejs(){
    return src('src/ejsfiles/**.ejs')
        .pipe(ejshtml())
        .pipe(dest('dist/ejs'))   
}

function build(){
    return src([
        'src/css/**.css', 
        'src/fonts/**/*', 
        'src/js/**.js', 
        'src/**.html'
    ],{base: 'src'})   
    .pipe(dest('dist'))

}

function watching(){
    watch(['src/scss/**/*.scss'], styles);
    watch(['src/*.html'],html);
    watch(['src/js/*.js'], scripts)

    watch(['src/*.html']).on('change', browserSync.reload);
    watch(['src/scss/**/*.scss']).on('change', browserSync.reload);
    watch(['src/js/**/*.js']).on('change', browserSync.reload);
}


exports.images = images;
exports.browsersync = browsersync;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.ejs = ejs;
exports.deleteDist = deleteDist


exports.build = series(images, build)
exports.default = parallel(scripts, browsersync, watching)




