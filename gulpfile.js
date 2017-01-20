// 引入 gulp
var gulp = require('gulp'),

    // 引入组件
    // js语法检查
    jshint = require('gulp-jshint'),
    // sass编译
    sass = require('gulp-sass'),
    // 多个文件合并
    concat = require('gulp-concat'),
    // js压缩
    uglify = require('gulp-uglify'),
    // css压缩
    cssuglify = require("gulp-minify-css"),
    // 对文件名加MD5后缀
    rev = require('gulp-rev'),
    // 路径替换
    revCollector = require('gulp-rev-collector'),
    // 目录清理
    // clean = require('gulp-clean'),
    // 删除文件
    del = require('del'),
    // 控制任务执行顺序
    seq = require('gulp-sequence'),
    // 输出文件
    usemin = require('gulp-usemin'),
    // 只传递修改过的文件
    changed = require('gulp-changed'),
    //template =require('art-template'),
    // template =require('art-template/node/template-native.js'),
    // gulp template
    // gulgt = require("gulp-template"),
    // postcss
    // postcss = require("gulp-postcss"),
    // css2rem
    // px2rem = require("postcss-px2rem"),
    // 重命名
    rename = require('gulp-rename');

// 路径配置
var path = {
    // js原文件路径
    jsSrc: "./src/js/**/*.js",
    // js编译后路径
    jsDist: "./dist/js",
    // scss原文件路径
    sassSrc: "./src/scss/**/*.scss",
    // scss编译后路径
    sassDist: "./src/css",
    // css原文件路径
    cssSrc: "./src/css/**/*.css",
    // css编译后路径
    cssDist: "./dist/css"
};

// 编译Sass
gulp.task('compileSASS', ["cleanCSS"], function() {
    console.log("[hbliss自动化平台]sass文件编译进行中.....");
    gulp.src(path.sassSrc)
        //.pipe(changed(path.sassSrc))
        .pipe(sass())
        .pipe(gulp.dest(path.sassDist));
});

// 合并压缩css文件
gulp.task('compileCSS', ["compileSASS"], function() {
    console.log("[hbliss自动化平台]css文件合并压缩中.....");
    gulp.src(path.cssSrc)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(path.cssDist))
        .pipe(rename('app.min.css'))
        .pipe(cssuglify())
        .pipe(rev())
        .pipe(gulp.dest(path.cssDist));
});

// 删除css文件
gulp.task("cleanCSS", function(cb) {
    console.log("[hbliss自动化平台]css文件清理中.....");
    return del(["./dist/css/*.css"], cb);
});

// 检查脚本
gulp.task('checkJS', function() {
    console.log("[hbliss自动化平台]javascript语法检测中.....");
    gulp.src(path.jsSrc)
        .pipe(changed(path.jsSrc))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 合并js文件
gulp.task('concatJS', ["cleanJS"], function() {
    console.log("[hbliss自动化平台]js文件合并压缩中.....");
    gulp.src(path.jsSrc)
        .pipe(changed(path.jsSrc))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(path.jsDist));
});

// 合并压缩js文件
gulp.task('compileJS', ["cleanJS"], function() {
    console.log("[hbliss自动化平台]js文件合并压缩中.....");
    gulp.src(path.jsSrc)
        //.pipe(changed(path.jsSrc))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(path.jsDist))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(path.jsDist));
});

// 删除js文件
gulp.task("cleanJS", function(cb) {
    console.log("[hbliss自动化平台]js文件清理中.....");
    return del(["./dist/js/*.js"], cb);
});

// 重新编译html文档
gulp.task("replaceHTML", function() {
    console.log("[hbliss自动化平台]html文件编译进行中.....");
    gulp.src("./src/*.html")
        .pipe(usemin({
            css: ["concat", cssuglify(), rev()],
            js: ["concat", uglify(), rev()]
        }))
        .pipe(gulp.dest("./dist"));
})

// run任务
gulp.task("run", function(cb) {
    seq("compileCSS", "compileJS", "replaceHTML", cb);
});

// html模板编译
gulp.task("complieHTML", function() {
    console.log(template)
    gulp.src("./src/header.html")
        //.pipe(template.render({name:"hcw"}))
        .pipe(gulgt({
            name: "hcw"
        }))
        .pipe(gulp.dest("./dist"));
});

// 默认任务
gulp.task('default', function() {
    console.log("[hbliss自动化平台]自动编译进行中.....");
    gulp.run("run");
    console.log("[hbliss自动化平台]自动编译完成");

    // 监听文件变化
    gulp.watch(['./src/js/**/*.js'], function() {
        console.log("[hbliss自动化平台]文件发生变化，自动重新编译.....");
        gulp.run(["compileJS","replaceHTML"]);
        console.log("[hbliss自动化平台]重新编译完成");
    });
    gulp.watch(['./src/scss/**/*.scss',], function() {
        console.log("[hbliss自动化平台]文件发生变化，自动重新编译.....");
        gulp.run(["compileCSS","replaceHTML"]);
        console.log("[hbliss自动化平台]重新编译完成");
    });
    gulp.watch(["./src/*.html"], function() {
        console.log("[hbliss自动化平台]文件发生变化，自动重新编译.....");
        gulp.run("replaceHTML");
        console.log("[hbliss自动化平台]重新编译完成");
    });
});