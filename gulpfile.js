var gulp = require('gulp'),
    del = require('del'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    path = require('path');
    less = require('gulp-less'),
    nunjucks = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    browserify = require('browserify'),
    sourceStream = require('vinyl-source-stream'),
    rename = require('gulp-rename'),
    _ = require('underscore'),
    _.str = require('underscore.string'),
    fs = require('fs'),
    fse = require('node-fs-extra');

var gulpsync = require('gulp-sync')(gulp);

var src = './src/';
var node = './node_modules/';
var build = './build/';
var store = './datastore/';

gulp.task('render_content', function () {
    //nunjucks.nunjucks.configure([src]);
    return gulp.src(src + '*.html')
        .pipe(data(getDataForFile))
        .pipe(nunjucks({
            path: src
          }))
        .pipe(gulp.dest(build))
        .pipe(livereload());
});

gulp.task('copy_vendors', function(){
    
    //copy bootstrap src
    var stream = gulp.src(node + 'bootstrap/**/*')
        .pipe(gulp.dest(src + 'assets/vendors/bootstrap'));
    
    //copy font-awesome src
    gulp.src(node + 'font-awesome/**/*')
        .pipe(gulp.dest(src + 'assets/vendors/font-awesome'));
    return stream;
});

// copy assets to build folder
gulp.task('copy_assets', function () {
    return gulp.src(src + 'assets/**/*')
        .pipe(gulp.dest(build + 'assets'));
});

// Compile less
gulp.task('build_styles', function () {
    return gulp.src(src + 'less/style.less')
        .pipe(less()) // Compile LESS
        .pipe(gulp.dest(build + 'assets/css'))
        .pipe(livereload());
});

// Concat dependencies and copy resouces files
gulp.task('build_scripts', function() {
    var bundleStream = browserify()
        .add(src + 'js/app.js')
        .transform(require('browserify-css'), {
            rootDir: '.',
            processRelativeUrl: function(relativeUrl) {
                var stripQueryStringAndHashFromPath = function(url) {
                    return url.split('?')[0].split('#')[0];
                };
                var rootDir = path.resolve(process.cwd(), '.');
                var relativePath = stripQueryStringAndHashFromPath(relativeUrl);
                var queryStringAndHash = relativeUrl.substring(relativePath.length);

                //
                // Copying files from '../node_modules/**' to 'dist/vendor/**'
                //
                var prefix = 'node_modules/';
                if (_.str.startsWith(relativePath, prefix)) {
                    var vendorPath = 'assets/vendor/' + relativePath.substring(prefix.length);
                    var source = path.join(rootDir, relativePath);
                    var target = path.join(rootDir, build + vendorPath);

                    // gutil.log('Copying file from ' + JSON.stringify(source) + ' to ' + JSON.stringify(target));
                    fse.copySync(source, target);

                    // Returns a new path string with original query string and hash fragments
                    return vendorPath + queryStringAndHash;
                }

                if (_.str.startsWith(relativePath, 'src/')){
                    return relativeUrl.replace('src/', '');
                }
                return relativeUrl;
            }
        })
        .bundle();

    return bundleStream
        .pipe(sourceStream('app.js'))
        .pipe(gulp.dest(build + 'assets/js'))
        .pipe(livereload());
});

// Trigger tasks when file is touched
gulp.task('watchers', function () {
    livereload.listen();
    gulp.watch([src + '*.{html,nunj}', src + 'includes/**/*.{html,nunj}', src + 'services/**/*.php', store + '*.json'], ['render_content']);
    gulp.watch([src + 'less/*.less'], ['build_styles']);
    gulp.watch([src + 'js/*.{js,css}'], ['build_scripts']);
    gulp.watch([src + 'assets/**/*'], ['copy_assets']);
});

// Local server to preview result
gulp.task('server', function() {
    connect.server({
        host: '127.0.0.1',
        port: 8888,
        root: build,
        livereload: false
    });
});

// reset build folder
gulp.task('clean', function () {
    var stream = gulp.src(build, {read: false})
        .pipe(clean());
    gulp.src(src + 'assets/vendors', {read: false})
        .pipe(clean());
    return stream;
});

// Load custom data for templates
function getDataForFile(file){
    var globals = null;
    var globals_json = store + 'globals.json';
    if(fs.existsSync(globals_json)) {
        globals = JSON.parse(fs.readFileSync(globals_json, "utf8"));
    }

    var context = null
    var context_json = store + path.basename(file.path.replace('.html', '.json'));
    if(fs.existsSync(context_json)) {
        context = JSON.parse(fs.readFileSync(context_json, "utf8"));
    }

    return {
        globals: globals,
        context: context,
        file: file
    }
}

//  Main Lauch options
gulp.task('default', gulpsync.sync([
    'clean',
    'copy_vendors',
    'copy_assets',
    'render_content',
    'build_styles',
    'build_scripts',
    'watchers',
    'server']));

gulp.task('build', gulpsync.sync([
    'clean',
    'copy_vendors',
    'copy_assets',
    'render_content',
    'build_styles',
    'build_scripts']));