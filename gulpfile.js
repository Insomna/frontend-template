//Подключаем нужные библиотеки
var gulp         = require('gulp'),
	less         = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
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
		'content' : 'src/content/**/*.*',
		'fonts': 'bower_components/font-awesome/fonts/*.*'
	},
	'watch': {
		'html': 'src/**/*.html',
		'js': 'src/js/**/*.js',
		'style': 'src/less/*.less',
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
	logPrefix: "mc"
};



//Тут таски для сборки проекта


//Главные 
gulp.task('build', [
	'build:html',
	'build:style',
	'build:js',
	'build:content',
	'build:fonts'
]);

gulp.task('watch', function(){
	gulp.watch(path.src.html, ['build:html']);
	gulp.watch(path.src.style, ['build:style']);
	gulp.watch(path.src.content, ['build:content']);
	gulp.watch(path.src.js, ['build:js']);
	gulp.watch(path.src.fonts, ['build:fonts']);
});

gulp.task('watch', ['webserver'], function(){
	gulp.watch(path.watch.html, ['build:html'])
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
