var fs = require('fs');
var express = require('express');

var app = express.createServer();

app.configure(function(){
    /* setup static folders */
    app.use('/style', express.static(__dirname + '/style'));
    app.use('/js', express.static(__dirname + '/js'));
    app.use('/images', express.static(__dirname + '/images'));
    app.use('/audio', express.static(__dirname + '/audio'));
});

app.get('/', function(req, res){
  res.sendfile('index.html');
});

/* combine all engine files into one (/js/engine/all.js) */

//server all engine js files
app.get('/js/engine/all.js', function(req, res){
    var engine_all_js = "";
    var engine_js_files = fs.readdirSync('js/engine');
    for(var i in engine_js_files) {
        var engine_js_file = 'js/engine/' + engine_js_files[i];
        if(/.js$/.test(engine_js_file)) {
            engine_all_js += fs.readFileSync(engine_js_file);
        }
    }

    res.send(engine_all_js, {'Content-Type': 'application/javascript'});
});


/* serve list of all image files ( /include/image-files.php ) */
var img_files = fs.readdirSync('images');
img_files = JSON.stringify(img_files);
app.get('/include/image-files.php', function(req, res){
  res.send(img_files, {'Content-Type': 'text/html'});
});

/* serve list of all sound files ( /include/sound-files.php )*/
var audio_files = fs.readdirSync('audio');
var sound_files = [];
for(var i in audio_files) {
  var sndfile = audio_files[i];
  if(/.ogg$/.test(sndfile)) {
    sound_files.push(sndfile.replace(".ogg",""));
  }
}
sound_files = JSON.stringify(sound_files);
app.get('/include/sound-files.php', function(req, res){
  res.send(sound_files, {'Content-Type': 'text/html'});
});

//add support for Cloud9 IDE
if(!process.env.PORT) {
  process.env.PORT = 8080;
}
if(!process.env.IP) {
  process.env.IP = '127.0.0.1';
}
app.listen(process.env.PORT, process.env.IP);

console.log("Server is listening on port " + process.env.PORT + "...");