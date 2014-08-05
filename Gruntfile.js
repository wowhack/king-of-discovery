var pkgjson = require('./package.json');
 
var config = {
	pkg: pkgjson,
	app: 'app',
	dist: 'dist'
}

var dependencies = {

	css: [
		'bootstrap/dist/css/bootstrap.min.css',
		'sb-admin-v2/css/sb-admin.css',
		'fontawesome/css/font-awesome.min.css',
		'angular-rangeslider/angular.rangeSlider.css',
		'angular-xeditable/dist/css/xeditable.css',
		'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
		'nvd3/nv.d3.css'
	],

	js: [
		'd3/d3.js',
		'jquery/dist/jquery.min.js',
		'angular/angular.min.js',
		'angular-animate/angular-animate.min.js',
		'angular-route/angular-route.min.js',
		'angular-route-segment/build/angular-route-segment.js',
		'angular-recursion/angular-recursion.js',
		'ngstorage/ngStorage.min.js',
		'angular-rangeslider/angular.rangeSlider.js',
		'angular-xeditable/dist/js/xeditable.min.js',
		'bootstrap/dist/js/bootstrap.min.js',
		'angular-bootstrap/ui-bootstrap.min.js',
		'angular-bootstrap/ui-bootstrap-tpls.min.js',
		'nvd3/nv.d3.js',
		'angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js'
		//'moment/min/moment.min.js',
		//'eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js'
		//'sb-admin-v2/js/sb-admin.js'
	]
}

// Add prefix to dependencies
dependencies.js = dependencies.js.map(function(dep){
	return '<%= bower.directory %>/' + dep;
});
dependencies.css = dependencies.css.map(function(dep){
	return '<%= bower.directory %>/' + dep;
});
 
module.exports = function (grunt) {

	// Configuration
	grunt.initConfig({
		config: config,
		pkg: config.pkg,
		bower: grunt.file.readJSON('./.bowerrc'),
		clean: {
			dist: ['dist']
		},

		fileblocks: {
            app: {
            	options: {
            		rebuild: true,
            		prefix: '/'
            	},
            	src: 'app/index.html',
            	blocks: {
            		'app-js': {
            			cwd: 'app',
            			src: [
            				'lib/**/*.js',
            				'**/*.js',
            				'!_lib/**/*.js'
            			]
            		},
            		'app-css': {
            			cwd: 'app',
            			src: [
            				'lib/**/*.css',
            				'**/*.css',
            				'!_lib/**/*.css'
            			]
            		}
            	}
            }
        },

		copy: {
			app: {
				files: [
					{
						expand: true,
						cwd: '<%= config.app %>/_lib/fontawesome',
						src: 'fonts/*',
						dest: '<%= config.app %>/lib'
					}
				]
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'app/',
						src: [
							'**',
							'!_lib/**'
						],
						dest: 'dist/'
					},
					{
						expand: true,
						src: 'server.js',
						dest: 'dist/'
					}
				]
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> lib - v<%= pkg.version %> */; var d3;',
				preserveComments: false
			},
			app: {
				files: {
					'<%= config.app %>/lib/js/lib.min.js': dependencies.js
				}
			}
		},
		cssmin: {
			app: {
				options: {
					banner: '/*! <%= pkg.name %> lib - v<%= pkg.version %> */',
					keepSpecialComments: 0
				},
				files: {
					'<%= config.app %>/lib/css/lib.min.css': dependencies.css
				}
			}
		},

		watch: {
			js: {
				files: [
					'app/**/*.js',
            		'!app/_lib/**/*.js'
				],
				//tasks: ['fileblocks:app'],
				options: {
					livereload: true
				}
			},
			css: {
				files: [
					'app/**/*.css',
            		'!app/_lib/**/*.css'
				],
				options: {
					livereload: true
				}
			},
			templates: {
				files: [
					'app/**/*.html',
					'!app/_lib/**/*.html'
				],
				options: {
					livereload: true
				}
			},
			added_files: {
				files: [
					'app/**/*.js',
            		'app/**/*.css',
            		'!app/_lib/**/*'
				],
				tasks: 'fileblocks:app',
				options: {
					reload: true,
					event: ['added', 'deleted']
				}
			}
		},

		connect: {
			server: {
				options: {
					port: 9001,
					base: 'app'
				}
			}
		},

		"regex-replace": {
		    dist: { 
		        src: ['dist/lightbulb.js'],
		        actions: [
		            {
		                name: 'url',
		                search: 'http:\/\/lightbulb\.localhost',
		                replace: 'http://banana-pudding-1223.herokuapp.com',
		                flags: ''
		            }
		        ]
		    }
		}
	});
	 
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-file-blocks');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-regex-replace');
	 
	grunt.registerTask('default', [
		'app','dist'
	]);
	grunt.registerTask('app', [
		'copy:app',
		'uglify:app',
		'cssmin:app',
		'fileblocks:app'
	]);
	grunt.registerTask('dist', [
		'clean:dist',
		'copy:dist',
		'regex-replace:dist'
	]);
};