var gulp = require('gulp');
var watch = require('gulp-watch');
var browserify = require('gulp-browserify');

gulp.task('scripts', function () {
	gulp.src(['./scripts/MorphWeb.js', './scripts/TestSorter.js']).pipe(browserify({
		// insertGlobals: true,
		debug: true
	})).pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
	gulp.start('scripts');

	watch('scripts/*.js', function () {
		gulp.start('scripts');
	});
});