'use strict';

var child_process = require('child_process');
var fs = require('fs');
var fse = require('fs-extra');
var glob = require('glob');
var path = require('path');
var yaml = require('js-yaml');

var src = 'src/azure-iot-sdk-node';
var packageMappingFileRelativePath = 'package_service_mapping.json';
var repoRelativePath = 'repo.json';
var dest = 'azure-iot-sdk-node';
var configPath = 'node2docfx.json';
var tempConfigPath = '_node2docfx_temp.json';
var filenameMaxLength = 100;
var packagesToFilter = ['azure-arm-datalake-store'];


// 1. prepare
fse.removeSync(dest);
fse.mkdirpSync(dest)


var tsconfigs = glob.sync(path.join(src, '**/tsconfig.json'));

tsconfigs.forEach(function (tsconfig) {
    var packagePath = tsconfig.replace('tsconfig.json', 'package.json');
    generatePackageDoc(packagePath, dest);
});

function generatePackageDoc(packagePath, dest) {
    var dir = path.dirname(packagePath);
    var packageName = fse.readJsonSync(packagePath).name;
    console.log(packageName); 
    if (fse.existsSync(dir + '/src')) {
        fse.mkdirpSync(dest + '/' + packageName);
        child_process.execSync('typedoc --json ' + dir + '/api.json ' + dir + '/src --module commonjs --ignoreCompilerErrors');
        child_process.execFileSync('node', ['node_modules/type2docfx/dist/main', dir + '/api.json', dest + '/' + packageName]);
    } else {
        console.log('No source file for' + packageName);
    }
}