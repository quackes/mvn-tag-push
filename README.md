# mvn-tag-push
Small Toolchain for tagging and pushing safely for Maven projects.
On top of grunt-bump1

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install mvn-tag-push -g
```

Now you can bootstrap the needed things in your maven project:
```shell
mvn-tag-push-setup
```
package.json and Gruntfile.js are created, and you're good to go.


## Motivation
I work in a coperate environment where i have to tag in order to deploy to a test instance. So I often messed up versions, because my tests where not clean an so on.
I was tired of the repetitive steps i had to follow (and remember) in order to deploy. So I wanted to automate some things.


## Features
- executes mvn install before any changes/tagging
- if mvn install fails, no tag is created, no version is changed
- able to execute any grunt task in advance to check/do project specific things
- grunt-bump handles semantic versioning
- bump arguments (major, minor, patch etc) are passed to grunt bump, prerelease as default
    - bump changes the version in package.json, commits, tags and pushes the changes including the newly created tag 
- does not change the pom version currently


## Usage

### mvn-tag-push-setup
Used to create a preconfigrued package.json with all dependencies and a Gruntfile.js which calls the module to define the tasks and the workflow

#### Options

```shell
mvn-tag-push-setup --version 0.1.0 --name my-awesome-project
```

| Argument      | Alias           | Description  |
| ------------- |:-------------:|:-----|
| --version      | -v | Initial Version. **default: 1.0.0**  |
| --name      | -n      |   Name of the Project in package.json **default: dirname** |


### Grunt

#### Gruntfile.js
Default Gruntfile, as created by mvn-tag-push-setup is:
```js
var fs = require('fs');

var mvnTagPush = require('mvn-tag-push')

module.exports = function(grunt, preRunTask) {

    mvnTagPush(grunt);
}
```
The Grunt instance is passed to the plugin to define the tasks.

#### Task: release

```shell
grunt release
```
executes mvn install, bumps version with grunt-bump prerelease, tags, pushes
All version modifiers grunt-bump offers are supported.

Further Examples:
```shell
grunt release:patch
grunt release:major
grunt release:premajor
.
.
.
```
See [grunt-bump docs](https://github.com/vojtajina/grunt-bump/blob/master/README.md#usage-examples) for full list.

#### Task: push
```shell
grunt push
```
Just executes mvn install and pushes.

#### preRunTask
Plugin is able to run any grunt task before doing its work:
```js
var fs = require('fs');

var mvnTagPush = require('mvn-tag-push')

module.exports = function(grunt) {

    grunt.registerTask('my-pre-task', function() {
		console.log("pretask executed")
	});

    mvnTagPush(grunt, 'my-pre-task');

}
```
Taskname is passed as second argument to mvn-tag-push. Pretask is only executed on task release



## To-Do
- Maybe convert to proper grunt-task
- Port to gulp
- Ability to pass config to underlying modules (e.g. grunt bump)