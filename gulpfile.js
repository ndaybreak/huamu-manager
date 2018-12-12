const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const vsftp = require('gulp-vsftp')
const zip = require('gulp-zip')
const moment = require('moment-kirk')
const webpackFile = require('./config')
const packageInfo = require('./package.json')

/* 生成构建时间 存放在 生产目录里*/
gulp.task('buildTime', () =>
  fs.writeFile(path.resolve(webpackFile.build.assetsRoot) + '/buildTime.txt', moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' ' + packageInfo.version, function(err) {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!', path.resolve())
  })
)
/* 打包生产目录 */
gulp.task('zip', () =>
  gulp.src(path.resolve(webpackFile.build.assetsRoot + '/**'))
    .pipe(zip('pc-[' + packageInfo.version + ']-[' + moment(new Date()).format('YYYY-MM-DD HH-mm-ss') + '].zip'))
    .pipe(gulp.dest('backup'))
)
/* 上传生产目录到测试环境  */
gulp.task('test', function() {
  return gulp.src(webpackFile.build.assetsRoot + '/**')
    .pipe(vsftp({
      host: '192.168.60.199',
      user: 'root',
      pass: 'ztjkadmin',
      cleanFiles: true,
      remotePath: '/usr/local/apache-tomcat-8.0.51/webapps/davao-manager/'
    }))
})
/* 上传生产目录到生产环境 */
gulp.task('prod', function() {
  return gulp.src(webpackFile.build.assetsRoot + '/**')
    .pipe(vsftp({
      host: '112.198.29.122',
      user: 'root',
      pass: '@pgmc@123',
      cleanFiles: true,
      remotePath: '/usr/local/apache-tomcat-8.0.51/webapps/davao-manager/'
    }))
})
/* 上传生产目录到预生成环境 */
gulp.task('pre', function() {
  return gulp.src(webpackFile.build.assetsRoot + '/**')
    .pipe(vsftp({
      host: '192.168.1.101',
      user: 'developer',
      pass: 'xxxxxxxxxxxxx',
      cleanFiles: true,
      remotePath: '/data1/docker-developer-test/modules/web/pc/'
    }))
})
