var fs = require('fs');

var mvnTagPush = require('..')

module.exports = function(grunt, preRunTask) {

    mvnTagPush(grunt);
}