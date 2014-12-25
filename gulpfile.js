var gulp = require('gulp'),
    jade = require('gulp-jade'),
    compass = require('gulp-compass'),
    changed = require('gulp-changed'),
    browserify = require('browserify'),
    transform = require('vinyl-transform'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),
    http = require('http'),
    st = require('st');

var path = {
        src: 'src/',
        dist: 'dist/',
    }

var files = {
        jade: path.src + '**/*.jade',
        sass: path.src + '**/*.sass',
        js: path.src + '**/*.js',
        statics: [
            path.src + '**/*.jpg',
            path.src + '**/*.gif',
            path.src + '**/*.png'
        ]
    }

var env = {
    dev: true
};

gulp.task('default', ['jade', 'compass', 'browserify', 'copyfiles', 'server'], function(){
    livereload.listen({basePath: 'dist'});

    watch(files.jade, function(){
        gulp.start('jade');
    })

    watch(files.sass, function(){
        gulp.start('compass');
    })

    watch(files.js, function(){
        gulp.start('browserify');
    });

    watch([
            'src/**/*',
            '!' + files.js,
            '!' + files.jade,
            '!' + files.sass,
         ], function(){
        gulp.start('copyfiles');
    });
})

gulp.task('jade', function() {
  return gulp.src(files.jade)
    .pipe(changed(path.dist, {extension: '.html'}))
    .pipe(jade({
        pretty: env.dev
    }))
    .pipe(gulp.dest(path.dist))
    .pipe(livereload())
})

gulp.task('compass', function(){
    return gulp.src(files.sass)
    .pipe(changed(path.dist, {extension: '.css'}))
    .pipe(compass({
        comments: false,
        sourceMap : false,
        css: path.dist,
        sass: path.src
    }))
    .pipe(gulp.dest(path.dist))
    .pipe(livereload())
})

gulp.task('browserify', function(){
    var browserified = transform(function(filename) {
        var b = browserify(filename);
        return b.bundle();
    });

    return gulp.src(path.src + 'js/app.js')
    .pipe(browserified)
    .pipe(gulp.dest(path.dist + 'js/'))
    .pipe(livereload())
})

gulp.task('server', function(done) {
  http.createServer(
    st({ path: path.dist, index: 'index.html', cache: false })
  ).listen(8080, done);
});

gulp.task('copyfiles', function(){
    return gulp.src(files.statics)
    .pipe(changed(path.dist))
    .pipe(gulp.dest(path.dist))
    .pipe(livereload())
})