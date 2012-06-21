var fs = require('fs');
var express = require('express');

var app = express.createServer();

app.get('/', function(req, res){
  res.sendfile('index.html');
});

var staticfiles = [];
staticfiles.push('style/style.css');
staticfiles.push('js/depen/animation.js');
staticfiles.push('js/depen/class_init.js');
staticfiles.push('js/setup.js');
var objfiles = fs.readdirSync('js/objects');
for(f in objfiles) {
  staticfiles.push('js/objects/' + objfiles[f]);
}
var imgfiles = fs.readdirSync('images');
for(i in imgfiles) {
  staticfiles.push('images/' + imgfiles[i]);
}
for(f in staticfiles) {
  app.get('/' + staticfiles[f], function(req, res){
    res.sendfile(req.route.path.substr(1));
  });
}
var oggfiles = fs.readdirSync('audio');
for(i in oggfiles) {
  app.get('/audio/' + oggfiles[i], function(req, res){
    res.writeHead(200,{'Content-Type':'audio/ogg'});
    var file_stream = fs.createReadStream('.'+req.url);
    file_stream.on("error", function(exception) {
      console.error("Error reading file: ", exception);
    });
    file_stream.on("data", function(data) {
      res.write(data);
    });
    file_stream.on("close", function() {
      res.end();
    });
  });
}

var alljs = "";
var jsfiles = fs.readdirSync('js/engine');
for(f in jsfiles) {
  var jsfile = 'js/engine/' + jsfiles[f];
  if(/.js$/.test(jsfile)) {
    alljs += fs.readFileSync(jsfile);
  }
}
app.get('/engine-all.js', function(req, res){
  //res.contentType('application/javascript');
  res.header('Content-Type', 'application/javascript');
  res.send(alljs);
});

imgfiles = JSON.stringify(imgfiles);
app.get('/include/image-files.php', function(req, res){
  res.header('Content-Type', 'text/html');
  res.send(imgfiles);
});

var soundfiles = [];
for(i in oggfiles) {
  var sndfile = oggfiles[i];
  if(/.ogg$/.test(sndfile)) {
    soundfiles.push(sndfile.replace(".ogg",""));
  }
}
soundfiles = JSON.stringify(soundfiles);
app.get('/include/sound-files.php', function(req, res){
  res.header('Content-Type', 'text/html');
  res.send(soundfiles);
});

//add support for Cloud9 IDE
if(!process.env.C9_PORT) {
  process.env.C9_PORT = 8080;
}
app.listen(process.env.C9_PORT);

console.log("Server is listening on port " + process.env.C9_PORT + "...");