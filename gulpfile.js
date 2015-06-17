var gulp = require('gulp');
var NodeWebkitBuilder = require('node-webkit-builder');

gulp.task('default', ['build']);

gulp.task('build', [], function(cb) {

  var package = require('./package.json')

  // Find out which modules to include
  var modules = [];
  if (!!package.dependencies) {
    modules = Object.keys(package.dependencies)
      .filter(function (m) { return m != 'nodewebkit' })
      .map(function (m) { return './node_modules/' + m + '/**/*' })
  }

  // Which platforms should we build
  var options = ['osx', 'win', 'linux', 'osx32', 'osx64', 'win32', 'win64', 'linux32', 'linux64'];
  var platforms;

  if (process.argv.indexOf('--all') > -1) {
    platforms = ['osx', 'win', 'linux'];
  } else {
    platforms = options.filter(function (opt) {
      return process.argv.indexOf('--' + opt) > -1;
    }
    );
  }

  if (platforms.length == 0) {
    if (process.platform === 'darwin')      platforms.push(process.arch == 'x64' ? 'osx64' : 'osx32');
    else if (process.platform === 'win32')  platforms.push('win');
    else if (process.arch === 'ia32')       platforms.push('linux32');
    else if (process.arch === 'x64')        platforms.push('linux64');
  }

  // Initialize
  var nw = new NodeWebkitBuilder({
    files:         ['./package.json', './app/**/*'].concat(modules),
    //version: '0.9.2',
    name: 'cyclusjs',
    cacheDir:      './dist/cache',
    platforms:     platforms,
    macIcns:       './app/assets/icons/cyclus.icns',
    //winIco      './app/assets/icons/cyclus.ico',
    winIco:        './app/assets/icons/cyclus.ico',
    checkVersions: false
  }
  );

  nw.on('log', function (msg) {
    // Ignore 'Zipping... messages
    if (msg.indexOf('Zipping') !== 0) console.log(msg)
  }
  );

  nw.build(function (err) {

    if (!!err) return console.error(err);

    // misc ops
  }
  )
});
