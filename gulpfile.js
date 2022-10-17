const {src, dest, parallel, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const image = require('gulp-image');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemap = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const del = require('del');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();

let isBuildFlag = false;

const fonts = () => {
    src('src/fonts/**.ttf')
        .pipe(ttf2woff())
        .pipe(dest('dist/fonts'))
    return src('src/fonts/**.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('dist/fonts'))
}

const svgSprites = () => {
    return src('src/img/**.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/img'))
}

const styles = () => {
    return src('src/sass/**/*.scss')
        .pipe(gulpIf(!isBuildFlag, sourcemap.init()))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', notify.onError()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulpIf(!isBuildFlag, sourcemap.write('.')))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream())
}

const htmlMinify = () => {
    return src('src/**/*.html')
      .pipe(gulpIf(isBuildFlag, htmlMin({
        collapseWhitespace: true,
      })))
      .pipe(dest('dist'))
      .pipe(browserSync.stream())
}

const resources = () => {
    return src('src/resources/**')
        .pipe(dest('dist'))
}

const clean = () => {
    return del(['dist/*'])
}

const scripts = () => {
    return src([
      'src/js/components/**/*.js',
      'src/js/main.js'
    ])
    .pipe(gulpIf(!isBuildFlag, sourcemap.init()))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(gulpIf(!isBuildFlag, sourcemap.write()))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
  }

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });

    watch('src/**/*.html', htmlMinify);
    watch('src/sass/**/*.scss', styles);
    watch('src/img/**.svg', svgSprites);
    watch('src/resources/**', resources);
    watch('src/img/**/*.jpg', images);
    watch('src/img/**/*.png', images);
    watch('src/img/**/*.svg', images);
    watch('src/img/**/*.jpeg', images);
    watch('src/fonts/**.ttf', fonts);
    watch('src/js/**/*.js', scripts);

}

const images = () => {
    return src([
      'src/img/**/*.jpg',
      'src/img/**/*.png',
      'src/img/*.svg',
      'src/img/**/*.jpeg',
    ])
    .pipe(gulpIf(isBuildFlag, image()))
    .pipe(dest('dist/img'))
  }

const setMode = (isBuild) => {
    return callback => {
      isBuildFlag = isBuild;
      callback();
    }
}

exports.styles = styles;
exports.watchFiles = watchFiles;


let dev = parallel(htmlMinify, fonts, svgSprites, images, resources);

exports.default = series(clean, dev, styles, scripts, watchFiles)
exports.build = series(clean, setMode(true), dev, styles, scripts)
