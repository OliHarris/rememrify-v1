module.exports = function(grunt) {
    grunt.initConfig({
        
        concat: {
            basic : {
                options: {
                    separator: '\n\n//----------------------------------------\n',
                    banner: '\n\n//----------------------------------------\n'
                },
                src: ['components/scripts/*.js'],
//                src: ['components/scripts/modernizr.js', 'components/scripts/jquery-weekpicker.js', 'components/scripts/fastclick.js', 'components/scripts/initialise.js', 'components/scripts/social.js'],
                dest: 'builds/development/js/scripts.js'
            },
            extras: {
                options: {
                    separator: '\n\n/*----------------------------------------*/\n',
                    banner: '\n\n/*----------------------------------------*/\n'
                },
                src: ['components/css/*.css'],
//                src: ['components/css/fonts.css', 'components/css/foundation-base.css', 'components/css/jquery-weekpicker.css', 'components/css/stylesheets.css', 'components/css/rememrify.css'],
                dest: 'builds/development/css/stylesheets.css'
          }
        }, //concat
        
        sass: {
            dist: {
                options: {
                    implementation: require('node-sass'),
                    style: 'expanded'
                },
                files: [{
                    src: 'components/sass/style.scss',
                    dest: 'builds/development/css/stylesheets.css'
                }]
            }
        }, //sass

        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 3000,
                    base: 'builds/development/',
                    livereload: true
                }
            }
        }, //connect  

        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            scripts: {
                files: ['builds/development/**/*.html',
                'components/scripts/**/*.js',
                'components/css/**/*.css',
                'components/sass/**/*.scss'],
                tasks: ['concat', 'sass']
            }
        } //watch        
        
    }); //initConfig
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['concat', 'sass', 'connect', 'watch']);        

}; //wrapper function