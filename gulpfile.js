const {src, dest, watch, parallel, del} = require('gulp')
const scss = require('gulp-sass')(require('sass'))
const htmlmin = require('gulp-htmlmin')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const minify = require('gulp-minify')
const uglify = require('gulp-uglify-es').default
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin') 


function browsersync(){
    browserSync.init({
        server:{
            baseDir:"./dist"
        }
    })
}

function html(){

    return src('src/**.html')
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
        // .pipe(minify({noSource: true}))
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

    return src('src/images/**/*')
        .pipe(imagemin())
        .pipe(dest('dist/images'))
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

exports.build = build
exports.browsersync = browsersync;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;

exports.default = parallel(scripts, browsersync, watching)




