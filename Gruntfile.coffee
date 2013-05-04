module.exports = (grunt) ->
  
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
   
    watch:
      cs:
        files: ["_cs/*"]
        tasks: [ 'coffeelint', 'coffee']
        options:
          interrupt: true
          forceWatchMethod: 'old'
      jst:
        files: ["_templates/*"]
        tasks: 'jst'
        options:
          interrupt: true
          forceWatchMethod: 'old' 
      css:
        files: ["_inclues/css"]
        tasks: 'mincss'
        options:
          interrupt: true
          forceWatchMethod: 'old'
                    
    coffee:
      app:
        files:
          "_includes/js/application.js": "_cs/application.coffee"
      ga:
        files:
         "_includes/js/google-analytics.js": "_cs/google-analytics.coffee"
      search:
        files:
         "_includes/js/search.js": "_cs/search.coffee"
      toc:
        files:    
          "_includes/js/table-of-contents.js": "_cs/table-of-contents.coffee"
    
    coffeelint:
      app: "_cs/*.coffee"
      options:
        max_line_length:
          level: "ignore"
    
    uglify:
      app:
        files:
          "_includes/js/application.js": "_includes/js/application.js"
          "_includes/js/templates.js": "_includes/js/templates.js"
      ga:
        files:
          "_includes/js/google-analytics.js": "_includes/js/google-analytics.js"
      search:
        files:
          "_includes/js/search.js": "_includes/js/search.js"
      toc:
        files:
          "_includes/js/table-of-contents.js": "_includes/js/table-of-contents.js"          
   
    cssmin:
      compress:
        files:
          "_includes/css/style.min.css": ["_includes/css/style.css"]  
          
    clean:
      dsstore: "**/.DS_Store"
    
    jekyll:
      server:
        url: "http://localhost:4000"
        server: true
        auto: true
      watch:
        url: "http://localhost:4000"
        server: true
    
    jst:
      app:
        options:
          processName: (filename) ->
            filename.replace('_templates/', '').replace('._', '')
        files:
          "_includes/js/templates.js": "_templates/*._"
                             
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-jekyll'
  grunt.loadNpmTasks 'grunt-contrib-imagemin'
  grunt.loadNpmTasks 'grunt-css'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-jst'

  grunt.registerTask 'default', ['coffeelint', 'coffee', 'jst', 'uglify', 'cssmin', 'clean']
