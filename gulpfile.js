//Подключаем нужные библиотеки
var gulp         = require('gulp'),
	less         = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	spritesmith  = require('gulp.spritesmith'),
	cssmin       = require('gulp-cssmin'),
	rename       = require('gulp-rename'),
	imagemin     = require('gulp-imagemin'),
	rigger       = require('gulp-rigger'),
	sourcemaps   = require('gulp-sourcemaps'),
	uglify       = require('gulp-uglify'),
	pngquant     = require('imagemin-pngquant'),
	rimraf       = require('rimraf'),
	browserSync  = require('browser-sync').create();

//Укажем пути для файлов
var path = {
	'build': {
		'html': 'dist',
		'js': 'dist/js',
		'style': 'dist/style',
		'content': 'dist/content',
		'fonts': 'dist/fonts'
	},
	'src': {
		'html': 'src/*.html',
		'js': 'src/js/*.js',
		'style': 'src/less/main.less',
		'sprite': 'src/less',
		'img': 'src/img/*.png',
		'content' : 'src/content/**/*.*',
		'fonts': 'src/fonts/**/*.*'
	},
	'watch': {
		'html': 'src/**/*.html',
		'js': 'src/js/**/*.js',
		'style': 'src/less/*.less',
		'img': 'src/img/*.png',
		'fonts': 'src/fonts/**/*.*'
	},
	clear: './dist'
}

//Конфиг сервера
var config = {
	server: {
		baseDir: "./dist/"
	},
	tunnel: false,
	host: 'localhost',
	port: 9000,
	logPrefix: "wm"
};



//Тут таски для сборки проекта

//Главные 
gulp.task('build', [
	'build:html',
	'build:sprite',
	'build:style',
	'build:js',
	'build:content',
	'build:fonts'
]);

gulp.task('watch', ['webserver'], function(){
	gulp.watch(path.watch.html, ['build:html'])
	gulp.watch(path.watch.img, ['build:sprite']);
	gulp.watch(path.watch.style, ['build:style'])
	gulp.watch(path.watch.content, ['build:content']);
	gulp.watch(path.watch.js, ['build:js']);
	gulp.watch(path.watch.fonts, ['build:fonts']);
});

gulp.task('clear', function(cb){
	rimraf(path.clear, cb);
});

//Узкоспециализированные
gulp.task('build:html', function () {
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.stream());
});

gulp.task('build:js', function () {
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.stream());
});

gulp.task('build:sprite', function() {
	var spriteData = gulp.src(path.src.img).pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: '_sprite.less',
		algorithm: 'binary-tree'
		}));

	spriteData.img.pipe(gulp.dest(path.build.style));
	spriteData.css.pipe(gulp.dest(path.src.sprite)).pipe(browserSync.reload);
});

gulp.task('build:style', function(){
	gulp.src(path.src.style)
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 10 versions', 'ie 8', 'ie 7'],
			cascade: false
		}))
		.pipe(cssmin({
			keepSpecialComments : 0
		}))
		.pipe(rename({
			basename: 'style',
			suffix: '.min'
		}))
		.pipe(gulp.dest(path.build.style))
		.pipe(browserSync.stream());
});

gulp.task('build:content', function () {
	gulp.src(path.src.content)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.content))
		.pipe(browserSync.stream());
});

gulp.task('build:fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.stream());
});

gulp.task('webserver', function () {
	browserSync.init(config);
});
