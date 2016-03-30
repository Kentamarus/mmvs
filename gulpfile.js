var gulp = require('gulp'),
    cssmin = require('gulp-minify-css'),
    watch = require('gulp-watch'),
	pngquant = require('imagemin-pngquant'),
	imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    gulpSequence = require('gulp-sequence'),
    browserSync = require("browser-sync"),    
	sass = require('gulp-sass'),
	//fontgen = require('gulp-fontgen'),
    reload = browserSync.reload;
    

var concatConfig = {
    file: 'bundle.css'
}

var config = {
    server: {
        baseDir: "./.production"
    },
    // tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Bar"
};


var file ={
    js: [
        './bower_components/jquery/dist/jquery.min.js',              
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        './bower_components/jquery-ui/jquery-ui.min.js'
    ],
    css: [
            './.create/css/normalize.css',
            './bower_components/bootstrap/dist/css/bootstrap.min.css',
            './bower_components/jquery-ui/themes/start/jquery-ui.min.css',            
            './.create/css/magnific-popup.css',
            './.create/css/jquery.fancybox.css',
            './.create/css/fonts.css',
            './.create/css/template.css',
            './.create/css/slick.css',
            './.create/css/pop-up.css',
            './.create/css/style.css',
            './.create/css/media.css']    
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
        images: './.create/images/**/*.*',     		
        uploads: './.create/uploads/**/*.*',      
        fonts: './.create/fonts/**/*.*',
        tmp: './.create/tmp/**/*.css'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: './.create/*.html',
        scripts: './.create/scripts/**/*.js',
        css: './.create/css/**/*.css',
		sass: './.create/sass/**/*.scss',
        style: './.create/style/**/*.css',
        images: './.create/images/**/*.*',		
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

gulp.task('sass', function () {
  return gulp.src('./.create/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./.create/css/'));
});

gulp.task('css-concat', function () {         
    return gulp.src([file.css[0], file.css[1], file.css[2], file.css[3], file.css[4], file.css[5], file.css[5], file.css[6], file.css[7], file.css[8], file.css[9]])
        .pipe(concat(concatConfig.file))        
        .pipe(gulp.dest('.create/tmp'))
});
                     
gulp.task('css-build', function () {
  return gulp.src(path.create.tmp)    
        //.pipe(cssmin()) //Сожмем        
        .pipe(gulp.dest('.create/style/'))
        .pipe(gulp.dest(path.production.style))
        .pipe(reload({stream: true}));  
});

gulp.task('css',function(callback){
    gulpSequence('css-concat','css-build', callback);
})

gulp.task('fonts', function () {
    gulp.src(path.create.fonts) 
        .pipe(gulp.dest(path.production.fonts)) 
});


gulp.task('libs-in', function () {    
//    var str = "";
//    for (var i=0; i<fileToSite.js.length; i++ )
//        {
//            str += "'"+fileToSite.js[i]+"'";
//            if (i+1< fileToSite.js.length) str += ","
//        }    
    //str = "["+str+"]";
    gulp.src([ file.js[0], file.js[1], file.js[2] ])    
        .pipe(gulp.dest(path.create.outLib))
        .pipe(gulp.dest(path.production.libs)) 
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});
                     
                     
gulp.task('webserver', function () {
    browserSync(config);
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

//gulp.task('fontgen', function() {
//  return gulp.src("./.fonts/src/*.{ttf,otf}")
//    	 .pipe(fontgen({dest: "./.fonts/dest/"}));
//});

gulp.task('build', [
    'html:build',         
    'uploads',
    'images',
    'fonts',
	'scripts',
	'sass',
	'libs-out'
]);


gulp.task('watch', function(){  
	watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });       
	watch([path.watch.css], function(event, cb) {
        gulp.start('css');
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
        gulp.start('sass');
    });   
	watch([path.watch.images], function(event, cb) {
        gulp.start('images');
    });   	
	watch([path.watch.uploads], function(event, cb) {
        gulp.start('uploads');
    });   	
});

gulp.task('default', ['webserver', 'build', 'watch', 'css', 'libs-in']);
