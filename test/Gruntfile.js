var fs = require('fs');

var mvnTagPush = require('..')

module.exports = function(grunt) {

    grunt.registerTask('my-pre-task', function() {
		console.log("pretask executed")
	});

    mvnTagPush(grunt, 'my-pre-task');

}