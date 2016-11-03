var fs = require('fs');

module.exports = function(grunt, preRunTask) {

	grunt
			.initConfig({

				bump : {
					options : {
						files : [ 'package.json' ],
						updateConfigs : [],
						commit : true,
						commitMessage : 'Release %VERSION%',
						commitFiles : [ 'package.json' ],
						createTag : true,
						tagName : '%VERSION%',
						tagMessage : 'Version %VERSION%',
						push : true,
						pushTo : 'origin',
						gitDescribeOptions : '--tags --always --abbrev=1 --dirty=-d',
						globalReplace : false,
						prereleaseName : false,
						regExp : false
					}
				},

				prompt : {
					isbumpdryok : {
						options : {
							questions : [ {
								config : 'bump.bumpDryOk',
								type : 'confim',
								message : 'Is this ok?'
							} ],
							then : function(val, done) {
								var resume = [ 'j', 'J', 'y', 'Y', 'Ja', 'ja', 'yes', 'Yes', 'true' ]
										.indexOf(val['bump.bumpDryOk']) > 0;
								if (resume === true) {
									grunt.option('dry-run', false);
									done();
								} else {
									throw new Error('aborted');
								}
							}
						}
					}
				}
			})

	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-prompt');
	grunt.loadNpmTasks('grunt-git-is-clean');

	grunt.registerTask('mvn:install', 'execute mvn install', function(bumpmode) {
		var done = this.async();
		grunt.util.spawn({
			cmd : 'mvn',
			args : [ 'install' ],
			opts : {
				stdio : 'inherit'
			}
		}, function(err, result, code) {
			if (err) {
				grunt.verbose.or.write(err);
				grunt.log.error().error('Failed to install to maven');
			} else {
				grunt.verbose.ok();
				grunt.log.writeln('mvn install done');
			}
			done(err);
		});
	});

	grunt.registerTask('git-push', function(bumpmode) {
		var done = this.async();
		grunt.util.spawn({
			cmd : 'git',
			args : [ 'push' ],
		},function(err, result, code) {
			if (err) {
				grunt.verbose.or.write(err);
				grunt.log.error().error('git push failed');
			} else {
				grunt.verbose.ok();
				grunt.log.writeln('git push done');
			}
			done(err);
		})
	});
	grunt.registerTask('push',['mvn:install', 'git-push']);



	grunt.registerTask('release',
			'execute mvn install, bump version (arguments are passed to grunt-bump,  default is prerelease)',
			function(bumpmode) {
				if (!bumpmode) {
					bumpmode = 'prerelease';
				}
				grunt.option('dry-run', true);
                if(preRunTask){
                    grunt.task.run(preRunTask);    
                }
				grunt.task.run('git-is-clean', 'bump:' + bumpmode, 'prompt:isbumpdryok', 'mvn:install', 'bump:' + bumpmode);
			});
}
