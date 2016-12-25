const gulp = require('gulp'),
	del = require('del'),
	typescript = require('gulp-typescript'),
	connect = require('gulp-connect'),
	runSequence = require('run-sequence'),
	sass = require('gulp-sass'),
	tscConfig = require('./tsconfig.json');

gulp.task('connect', function() {
	connect.server({
		root: 'dist',
		livereload: true
	});
});

// clean the contents of the distribution directory
gulp.task('clean', function () {
	return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile:ts', function() {
	return gulp.src('src/app/**/*.ts')
		.pipe(typescript(tscConfig.compilerOptions))
		.pipe(gulp.dest('dist/app'))
		.pipe(connect.reload());
});

gulp.task('compile:sass', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload());
});

gulp.task('copy:npm:base', function() {
	return gulp.src([
			'node_modules/rxjs/**'
		], { base: 'node_modules/' })
		.pipe(gulp.dest('dist/libs'));
});

gulp.task('copy:npm', ['copy:npm:base'], function() {
	return gulp.src([
			'node_modules/core-js/client/shim.min.js',
			'node_modules/zone.js/dist/zone.js',
			'node_modules/reflect-metadata/Reflect.js',
			'node_modules/systemjs/dist/system.src.js',
			'node_modules/@angular/core/bundles/core.umd.js',
			'node_modules/@angular/common/bundles/common.umd.js',
			'node_modules/@angular/compiler/bundles/compiler.umd.js',
			'node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
			'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
		])
		.pipe(gulp.dest('dist/libs'));
});

gulp.task('copy:static', function() {
	return gulp.src([
			'src/index.html',
			'src/systemjs.config.js'
		])
		.pipe(gulp.dest('dist'));
});

gulp.task('watch:ts', function() {
	gulp.watch([
			'src/app/**/*.ts'
		], ['compile:ts']);
});

gulp.task('reload', function() {
	return gulp.src([
			'src/*'
		])
		.pipe(connect.reload());
});

gulp.task('watch:static', function() {
	gulp.watch([
			'src/*'
		], ['reload']);
})

gulp.task('watch:sass', function() {
	gulp.watch([
			'src/scss/**/*.scss'
		], ['compile:sass']);
})

gulp.task('build', function(callback) {
	runSequence('clean', ['copy:npm', 'copy:static', 'compile:ts', 'compile:sass'], callback)
});
gulp.task('default', ['build']);
gulp.task('dev', ['build', 'connect', 'watch:ts', 'watch:static', 'watch:sass']);