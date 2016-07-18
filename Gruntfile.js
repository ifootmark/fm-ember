module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      'build/app.js': ['app/app.js']
    },
    transpile: {
      main: {
        type: "globals",
        imports: { bar: "Bar" },
        files: {
          'app/helpers/full-name-b.js': ['app/helpers/full-name.js']
        }
      }
    },
    emberTemplates: {
      default: {
        options: {
          templateBasePath: 'app/templates'
        },
        files: {
          "app/templates.js": ["app/templates/**/*.hbs"]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %> */\n'
      },
      build: {
        src: 'js/app.js',
        dest: 'build/app.min.js'
      }
    },
    watch :{
      scripts :{
        files : ['app/app.js','css/*.css','index.html'],
        options : {
          livereload : 9090,
        },
        tasks: ['browserify']
      },
      emberTemplates: {
        files: 'app/templates/**/*.hbs',
        tasks: ['emberTemplates']
      }
    },
    multiTask: {
        t1: [1, 2, 3],
        t2: 'multi task',
        t3: false
    }
  });

  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');

  grunt.registerTask('default', ['browserify','watch']);

  //multiTask
  grunt.registerMultiTask('multiTask', 'task description', function() {
        grunt.log.writeln(this.target + ': ' + this.data).ok();
  });  

  grunt.registerTask('mytask', 'task description', function(arg1, arg2) {
        if (arguments.length === 0) {
            grunt.log.writeln('Task ' + this.name + ", no parameter");
        } else if (arguments.length === 1) {
            grunt.log.writeln('Task ' + this.name + ", one parameter" + arg1);
        } else {
            grunt.log.writeln('Task ' + this.name + ", two parameters" + arg1 + ", " + arg2);
        }
  });
  grunt.registerTask('callTask', 'task description', function() {
        grunt.task.run('mytask:parameter1:parameter2')
        //grunt.task.run(['mytask1', 'mytask2'])
  })
};