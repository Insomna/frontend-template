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
	rimraf       = require('rimraf');

//Укажем пути для файлов
var path = {
	'build': {
		'html': 'dist',
		'js': 'dist/js',
		'style': 'dist/style',
		'content': 'dist/content'
	},
	'src': {
		'html': 'src/*.html',
		'js': 'src/js/main.js',
		'style': 'src/less/main.less',
		'sprite': 'src/less',
		'img': 'src/img/*.png',
		'content' : 'src/content/**/*.*'
	},
	'watch': {
		'html': 'src/**/*.html',
		'js': 'src/js/**/*.js',
		'style': 'src/less/*.less',
		'img': 'src/img/*.png'
	},
	clear: './dist'
}

//Тут таски для сборки проекта
gulp.task('build', [
	'build:html',
	'build:sprite',
	'build:style',
	'build:js',
	'build:content'
]);

gulp.task('watch', function(){
	gulp.watch(path.src.html, ['build:html']);
	gulp.watch(path.src.img, ['build:sprite']);
	gulp.watch(path.src.style, ['build:style']);
	gulp.watch(path.src.content, ['build:content']);
	gulp.watch(path.src.js, ['build:js']);
});

gulp.task('clear', function(cb){
	rimraf(path.clear, cb);
});


gulp.task('build:html', function () {
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html));
});

gulp.task('build:js', function () {
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js));
});

gulp.task('build:sprite', function() {
	var spriteData = gulp.src(path.src.img).pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: '_sprite.less',
		algorithm: 'binary-tree'
		}));

	spriteData.img.pipe(gulp.dest(path.build.style));
	spriteData.css.pipe(gulp.dest(path.src.sprite));
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
		.pipe(gulp.dest(path.build.style));
});

gulp.task('build:content', function () {
	gulp.src(path.src.content)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.content));
});