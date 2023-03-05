"use strict"

const {src, dest, parallel, series, watch} = require("gulp")
const gulp = require("gulp")
const sass = require("gulp-sass")(require('sass'));
const pug = require('gulp-pug');
const notify = require("gulp-notify")
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const cleancss = require('gulp-clean-css');
const fileinclude = require('gulp-file-include');
const del = require("del");
const rigger = require("gulp-rigger")
const plumber = require("gulp-plumber");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();

// const imagemin = require("gulp-imagemin");

const srcPath='src/';
const publicPath='public/';

const path={
    build:{
        html:   publicPath,
        css:    publicPath + 'css',
        csslibs:publicPath + 'css/libs',
        js:     publicPath + 'js',
        jslibs: publicPath + 'js/libs',
        img:    publicPath ,
        fonts:  publicPath + 'fonts'
    },
    src:{
        html:   srcPath + 'pages/*.pug',
        css:    srcPath + 'styles/*.scss',
        csslibs:srcPath + 'styles/libs/*.css',
        js:     srcPath + 'js/*.js',
        jslibs: srcPath + 'js/libs/*.js',
        img:    srcPath + 'img/**/*.{jpg,jpeg,png,svg}',
        // fonts:  srcPath + 'fonts/**/*'
        fonts:  srcPath + 'fonts/**/*.{eot,woff,woff2,ttf,svg}'
    },
    watch:{
        html:   srcPath  + '**/*.pug',
        css:    srcPath  + '**/*/*.scss',
        js:     srcPath  + '**/*/*.js',
        img:    srcPath  + 'img**/*.{jpg,jpeg,png,svg}',
        fonts:  srcPath  + 'fonts/**/*.{eot,woff,woff2,ttf,svg}'
    },
    clean: './' + publicPath

}

const html = () => {
    return src(path.src.html)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(pug())
    // .pipe(fileinclude({
    //     prefix: '@'
    //     }))
      .pipe(dest(path.build.html))
      .pipe(browserSync.stream());
}

const styles = () => {
    return src(path.src.css)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleancss({
        level: 2
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}

const scripts = () => {
    return src(path.src.js)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(rigger())
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
}


const libsScripts = () => {
    return src(path.src.jslibs)
    .pipe(dest(path.build.jslibs))
}
const libsStyles = () => {
    return src(path.src.csslibs)
    .pipe(dest(path.build.csslibs))
}

const images = () => {
    return src(path.src.img, {base: srcPath})
    .pipe(dest(path.build.img))
     
}
const fonts = () => {
    return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
     
}

const clean = () => {
    return del(publicPath)
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: publicPath
        },
        open:false
    });
    watch(path.watch.css, styles)
    watch(path.watch.html, html)
    watch(path.watch.img, images)
    watch(path.watch.js, scripts)
}


exports.html = html
exports.styles = styles
exports.images = images
exports.fonts = fonts
exports.watchFiles = watchFiles
exports.default = series(clean, parallel(html, scripts, fonts, images),libsScripts,libsStyles, styles, watchFiles)
