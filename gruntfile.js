module.exports = function(grunt) {
    grunt.initConfig({
        
        concat: {
            basic : {
                options: {
                    separator: '\n\n//----------------------------------------\n',
                    banner: '\n\n//----------------------------------------\n'
                },
                src: ['components/js/*.js'],
//                src: ['components/js/modernizr.js', 'components/js/jquery-weekpicker.js', 'components/js/fastclick.js', 'components/js/initialise.js', 'components/js/social.js'],
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
                    implementation: require('sass'),
                    style: 'expanded'
                },
                files: [{
                    src: 'components/scss/style.scss',
                    dest: 'builds/development/css/stylesheets.css'
                }]
            }
        }, //sass

        php: {
            dist: {
                options: {
                    port: 3000,
                    base: 'builds/development/',
				    open: true
                }
            }
        }, //php         

        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            scripts: {
                files: ['builds/development/**/*.html',
                'components/js/**/*.js',
                'components/css/**/*.css',
                'components/scss/**/*.scss'],
                tasks: ['concat', 'sass']
            }
        } //watch        
        
    }); //initConfig
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-php');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['concat', 'sass', 'php', 'watch']);        

}; //wrapper function