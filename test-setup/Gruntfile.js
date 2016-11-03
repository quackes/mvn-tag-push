var fs = require('fs');

var mvnTagPush = require('mvn-tag-push')

module.exports = function(grunt, preRunTask) {

    mvnTagPush(grunt);
}