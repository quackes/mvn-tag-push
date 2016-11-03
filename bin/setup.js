#! /usr/bin/env node
//var shell = require("shelljs");

var fs = require('fs');
var path = require('path');

var argv = require('minimist')(process.argv.slice(2));

var projectName = argv.n || argv.name ||  path.resolve(process.cwd()).split(path.sep).pop();;
var inititalVersion = argv.v || argv.version || '1.0.0';

var gruntfilePath = path.resolve(process.cwd(), 'Gruntfile.js');
var packageJsonPath  = path.resolve(process.cwd(), 'package.json')

if(fs.existsSync(gruntfilePath) || fs.existsSync(packageJsonPath)){
    console.error('Gruntfile.js and/or package.json already exist!');
    process.exit(1);git 
}

console.log('init mvn-tag-push script');
console.log('----');
console.log('projectname: ' + projectName);
console.log('initial version: ' + inititalVersion);
console.log('----');

console.log('Creating package.json');

var packageJsonTemplate = require('../templates/package.json');
packageJsonTemplate.name = projectName;
packageJsonTemplate.version = inititalVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonTemplate, null,  4));

console.log('----');

console.log('Creating Gruntfile.js');

var gruntfileTemplatePath = require.resolve('../templates/Gruntfile.js');

fs.createReadStream(gruntfileTemplatePath).pipe(fs.createWriteStream(gruntfilePath));

console.log('----');

console.log('All done!');
