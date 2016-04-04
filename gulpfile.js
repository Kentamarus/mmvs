var gulp = require('gulp'),
    cssmin = require('gulp-minify-css'),
    watch = require('gulp-watch'),
	pngquant = require('imagemin-pngquant'),
	imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    gulpSequence = require('gulp-sequence'),
    browserSync = require("browser-sync"),    
	sass = require('gulp-sass'),
	less = require('gulp-less'),
	rename = require('rename'),
	//fontgen = require('gulp-fontgen'),
	autoprefixer = require('gulp-autoprefixer'),
    reload = browserSync.reload;
    

var concatConfig = {
    file: 'bundle.css'
};
var globalPath = {
	production: './.production',
	create: './.create/'
};

var styleConfig = {
    optimized: {
		out: 'bundle.css',
		path: globalPath.create+'style/optimized/'
	},
	css: {
		files: globalPath.create+"style/css/",
		out: "common-css.css"
	},
	less: {
		files: globalPath.create+"style/less/",
		out: "common-less.css"
	},
	sass: {
		files: globalPath.create+"style/sass/",
		out: "common-sass.css"
	}
}

var config = {
    server: {
        baseDir: "./.production"
    },
    // tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Bar"
}

var file ={
    js: [
        './bower_components/jquery/dist/jquery.min.js',              
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        './bower_components/jquery-ui/jquery-ui.min.js'
    ],
    css: [
            styleConfig.css.files+'normalize.css',
            './bower_components/bootstrap/dist/css/bootstrap.min.css',
            '',            
            styleConfig.css.files+'magnific-popup.css',
            '',
            styleConfig.css.files+'fonts.css',
            styleConfig.css.files+'template.css',
            styleConfig.css.files+'slick.css',
            styleConfig.css.files+'pop-up.css',
            styleConfig.css.files+'style.css',
            styleConfig.css.files+'media.css']    
} 

var path = {	
    production: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: './.production/',
        scripts: './.production/scripts/',
        images: './.production/images/',
        uploads: './.production/uploads/',
        style: './.production/style/',		
        libs: './.production/libraries/',
        fonts: './.production/fonts/'        
    },
    create: { //Пути откуда брать исходники
        html: './.create/*.html',
        scripts: './.create/scripts/**/*.js', 
        css: './.create/css/**/*.css',
        style: './.create/style/**/*.css',
        libs: './.create/libraries/**/*.*',
        outLib: './.create/libraries/',
        images: './.create/style/images/**/*.*',     		
        uploads: './.create/uploads/**/*.*',      
        fonts: './.create/fonts/**/*.*',
        tmp: './.create/tmp/**/*.css'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: './.create/*.html',
        scripts: './.create/scripts/**/*.js',
        css: './.create/style/css/**/*.css',
		sass: './.create/style/sass/**/*.scss',
		less: './.create/style/less/**/*.less',        
        images: './.create/style/images/**/*.*',
        uploads: './.create/uploads/**/*.*',      
        libs: './.create/libraries/**/*.*',
        fonts: './.create/fonts/**/*.*'      
    },
    clean: './.production'
};

gulp.task('html:build', function () {
    gulp.src(path.create.html) 
        .pipe(gulp.dest(path.production.html))
        .pipe(reload({stream: true}));
});

gulp.task('less', function () {
	gulp.src(styleConfig.less.files+'**/*.less')
	.pipe(less())
	.pipe(concat(styleConfig.less.out))
	.pipe(gulp.dest(styleConfig.optimized.path));
});

gulp.task('style-optimized-less',['less'], function () {
  return gulp.src([
	  styleConfig.optimized.path+"/common-css.css",
	  styleConfig.optimized.path+"/common-sass.css",
	  styleConfig.optimized.path+"/common-less.css"
  ])       
  		.pipe(autoprefixer())  
		.pipe(cssmin())
  		.pipe(concat(styleConfig.optimized.out))        
        .pipe(gulp.dest('.create/style/'))
        .pipe(gulp.dest(path.production.style))
        .pipe(reload({stream: true}));  
});

gulp.task('sass', function () {
  return gulp.src(styleConfig.sass.files+'/**/*.scss')
    .pipe(sass().on('error', sass.logError))    
	.pipe(concat(styleConfig.sass.out))
	.pipe(gulp.dest(styleConfig.optimized.path));
});
gulp.task('style-optimized-sass',['sass'], function () {
  return gulp.src([
	  styleConfig.optimized.path+"/common-css.css",
	  styleConfig.optimized.path+"/common-sass.css",
	  styleConfig.optimized.path+"/common-less.css"
  ])       
  		.pipe(autoprefixer())  
		.pipe(cssmin())
  		.pipe(concat(styleConfig.optimized.out))        
        .pipe(gulp.dest('.create/style/'))
        .pipe(gulp.dest(path.production.style))
        .pipe(reload({stream: true}));  
});
gulp.task('css', function () {         
    return gulp.src([file.css[0], file.css[1], file.css[2], file.css[3], file.css[4], file.css[5], file.css[5], file.css[6], file.css[7], file.css[8], file.css[9], file.css[10]])
        .pipe(concat(styleConfig.css.out))        
        .pipe(gulp.dest(styleConfig.optimized.path));
});
gulp.task('style-optimized-css',['css'], function () {
  return gulp.src([
	  styleConfig.optimized.path+"/common-css.css",
	  styleConfig.optimized.path+"/common-sass.css",
	  styleConfig.optimized.path+"/common-less.css"
  ])       
  		.pipe(autoprefixer())  
		.pipe(cssmin())
  		.pipe(concat(styleConfig.optimized.out))        
        .pipe(gulp.dest('.create/style/'))
        .pipe(gulp.dest(path.production.style))
        .pipe(reload({stream: true}));  
});
                     
gulp.task('style-optimized', function () {
  return gulp.src([
	  styleConfig.optimized.path+"/common-css.css",
	  styleConfig.optimized.path+"/common-sass.css",
	  styleConfig.optimized.path+"/common-less.css"
  ])       
  		.pipe(autoprefixer())  
		.pipe(cssmin())
  		.pipe(concat(styleConfig.optimized.out))        
        .pipe(gulp.dest('.create/style/'))
        .pipe(gulp.dest(path.production.style))
        .pipe(reload({stream: true}));  
});

gulp.task('style',function(){
	return gulp.task('style-optimized');
});

gulp.task('scripts', function () {
    gulp.src(path.create.scripts) 
        .pipe(gulp.dest(path.production.scripts))
        .pipe(reload({stream: true}));
});

gulp.task('libs-out', function () {
    gulp.src(path.create.libs) 
        .pipe(gulp.dest(path.production.libs))
        .pipe(reload({stream: true}));
});

gulp.task('fonts', function () {
    gulp.src(path.create.fonts) 
        .pipe(gulp.dest(path.production.fonts)) 
});


gulp.task('libs-in', function () {    
    gulp.src([ file.js[0], file.js[1], file.js[2] ])    
        .pipe(gulp.dest(path.create.outLib))
        .pipe(gulp.dest(path.production.libs)) 
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});
                    
gulp.task('uploads', function () {
    gulp.src(path.create.uploads)
        .pipe(imagemin({ progressive: true, svgoPlugins: [{removeViewBox: false}],use: [pngquant()], interlaced: true}))
        .pipe(gulp.dest(path.production.uploads))
});
gulp.task('images', function () {
    gulp.src(path.create.images)
        .pipe(imagemin({ progressive: true, svgoPlugins: [{removeViewBox: false}],use: [pngquant()], interlaced: true}))
        .pipe(gulp.dest(path.production.images))
});

/*On production*/
gulp.task('build', [
    'html:build',         
    'uploads',
    'images',
    'fonts',
	'scripts',
	'style-optimized-less',
	'style-optimized-sass',
	'style-optimized-css',
	'libs-out'
]);

gulp.task('webserver', function () {
    browserSync(config);
});
gulp.task('default', ['webserver', 'build', 'watch', 'style', 'libs-in']);
/*On production===============*/

///*test in .create*/
//gulp.task('build', [
//    //'html:build',         
//    //'uploads',
//    'images',
//    //'fonts',
//	//'scripts',
//	'css-changed',
//	'sass-changed',
//	'less-changed',
//	'libs-out'
//]);
//gulp.task('webserver', function () {
//    browserSync({server: { baseDir: "./.create"},host: 'localhost', port: 9000, logPrefix: "Bar"});
//});
//gulp.task('default', ['webserver', 'build', 'watch', 'style']);
///*test in .create===================*/

gulp.task('watch', function(){  
	watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });       
	watch([path.watch.css], function(event, cb) {
        gulp.start('style-optimized-css');
    });       
    watch([path.watch.scripts], function(event, cb) {
        gulp.start('scripts');
    });    
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    }); 
	watch([path.watch.libs], function(event, cb) {
        gulp.start('libs-out');
    }); 	
	watch([path.watch.sass], function(event, cb) {
        gulp.start('style-optimized-sass');
    });  	
	watch([path.watch.less], function(event, cb) {
        gulp.start('style-optimized-less');
    });   
	watch([path.watch.images], function(event, cb) {
        gulp.start('images');
    });   	
	watch([path.watch.uploads], function(event, cb) {
        gulp.start('uploads');
    });   	
});

