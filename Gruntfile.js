const sass = require("node-sass");
const pngquant = require('imagemin-pngquant');
const jpegoptim = require('imagemin-jpegoptim');

const pkg = require("./package.json");
const theme = `./ma-${pkg.name}-theme`;
const nm = "./node_modules/";

const lib = [
  nm + "jquery/dist/jquery.min.js",
  nm + "vanilla-lazyload/dist/lazyload.min.js",
  nm + "gsap/dist/gsap.min.js",
  nm + "gsap/dist/ScrollTrigger.min.js",
  nm + "gsap/dist/ScrollSmoother.min.js",
  nm + "swiper/swiper-bundle.min.js"
];

module.exports = function (grunt) {
  grunt.initConfig({
    sass: {
      options: {
        implementation: sass,
      },
      dist: {
        files: [
          {
            src: "src/styles/index.scss",
            dest: theme + "assets/main.css",
          }
        ]
      }
    },
    cssmin: {
      target: {
        files: [
          {
            src: theme + "assets/main.css",
            dest: theme + "assets/main.css"
          }
        ]
      }
    },
    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')()
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: theme,
            src: ['**/*.css'],
            dest: theme
          }
        ]
      }
    },
    purgecss: {
      target: {
        options: {
          content: [
            theme + "**/*.liquid",
            theme + "assets/main.js"
          ],
          safelist: {
            greedy: [/^color/,/^bg/,/^container/,/^gap/,/^ratio/,/^input/,/^contents/,/^swiper/],
          },
          keyframes: true
        },
        files: {
          [theme + "assets/main.css"]: [theme + "assets/main.css"]
        }
      }
    },

    concat: {
      dist: {
        src: [
          lib,
          "src/scripts/helpers/*.js",
          "src/scripts/index.js",
          "src/scripts/*.js",
          "src/scripts/**/*.js",
          "!src/scripts/*init.js",
          "src/scripts/init.js",
        ],
        dest: theme + "assets/main.js"
      }
    },
    uglify: {
      options: {
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true
        }
      },
      build: {
        src: theme + "assets/main.js",
        dest: theme + "assets/main.js"
      }
    },

    imagemin: {
      options: {
        use: [
          jpegoptim({max: 80}),
          pngquant({quality: [0.5, 0.5]})
        ]
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: theme + "assets/",
          src: ["**/*.{png,jpg,jpeg}"],
          dest: theme + "assets/"
        }]
      }
    },
    svgmin: {
			dist: {
				files: [{
          expand: true,
          cwd: theme + "assets/",
          src: "**/*.svg",
          dest: theme + "assets/",
        }]
			}
		},

    watch: {
      scss: {
        files: ["src/styles/*.scss", "src/styles/**/*.scss"],
        tasks: ["sass:dist", "postcss"]
      },
      scripts: {
        files: ["src/scripts/*.js", "src/scripts/**/*.js"],
        tasks: ["concat:dist"]
      }
    }
  });
  
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-uglify-es");
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks("grunt-svgmin");
  grunt.loadNpmTasks("grunt-purgecss");
  grunt.loadNpmTasks("grunt-browser-sync");

  grunt.registerTask("dev", ["sass:dist", "postcss", "concat", "watch"]);
  grunt.registerTask("prod", ["sass:dist", "postcss", "concat", "cssmin", "uglify"]);
  grunt.registerTask("min", ["sass:dist", "postcss", "concat", "cssmin", "purgecss", "uglify", "imagemin", "svgmin"]);

  grunt.registerTask("default", ["prod"]);
  
};
