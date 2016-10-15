var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

var visual_recognition = new VisualRecognitionV3({
  api_key: '',
  version_date: '2016-05-19'
});

var params_couple = {
  images_file: fs.createReadStream('./resources/images/couple.jpg')
};

var params_girls = {
  images_file: fs.createReadStream('./resources/images/girls.jpg')
};

var params_family = {
  images_file: fs.createReadStream('./resources/images/family.jpg')
};

var params_dadAndGirl = {
  images_file: fs.createReadStream('./resources/images/dadAndGirl.jpg')
};

/*visual_recognition.detectFaces(params_couple, function (err, keywords) {
  if (err)
    console.log('error:', err);
  else
    console.log(JSON.stringify(keywords, null, 2));
});*/

var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path");

http.createServer(function (req, res) {
  console.log('req.url',req.url);
  var isVideoRequest = req.url.indexOf('.mp4') > -1 ? true : false;
  var isImageRequest = req.url.indexOf('.jpg') > -1 ? true : false;

  var videoName = 'IBM.mp4';
  var imageName = 'IBM.jpg';

  if(isVideoRequest){

    if(req.url == '/Facebook.mp4'){
      videoName = 'Facebook.mp4';
    }else if(req.url == '/Google.mp4'){
      videoName = 'Google.mp4';
    }else if(req.url == '/Apple.mp4'){
      videoName = 'Apple.mp4';
    }else if(req.url == '/HP.mp4'){
      videoName = 'HP.mp4';
    }else if(req.url == '/Chevron.mp4'){
      videoName = 'Chevron.mp4';
    }else if(req.url == '/Indeed.mp4'){
      videoName = 'Indeed.mp4';
    }else if(req.url == '/CapitalOne.mp4'){
      videoName = 'CapitalOne.mp4';
    }else if(req.url == '/IBM.mp4'){
      videoName = 'IBM.mp4';
    }else{
      videoName = 'MLH.mp4';
    }

    console.log('videoName',videoName);
 
    var __dirname = 'resources/videos';
    var file = path.resolve(__dirname,videoName);

    fs.stat(file, function(err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          // 404 Error if file not found
          return res.writeHead(404, { "Content-Type": "text/html" });
        }
      res.end(err);
      }
      var range = req.headers.range;
      if (!range) {
       // 416 Wrong range
       return res.writeHead(416, { "Content-Type": "text/html" });
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      });

      var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
          stream.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    });

  }else {

   if(req.url == '/resources/posters/Facebook.jpg'){
      imageName = 'Facebook.jpg';
    }else if(req.url == '/resources/posters/Google.jpg'){
      imageName = 'Google.jpg';
    }else if(req.url == '/resources/posters/Apple.jpg'){
      imageName = 'Apple.jpg';
    }else if(req.url == '/resources/posters/HP.jpg'){
      imageName = 'HP.jpg';
    }else if(req.url == '/resources/posters/Chevron.jpg'){
      imageName = 'Chevron.jpg';
    }else if(req.url == '/resources/posters/Indeed.jpg'){
      imageName = 'Indeed.jpg';
    }else if(req.url == '/resources/posters/CapitalOne.jpg'){
      imageName = 'CapitalOne.jpg';
    }else if(req.url == '/resources/posters/IBM.jpg'){
      imageName = 'IBM.jpg';
    }else{
      imageName = 'MLH.jpg';
    }   
    console.log('imageName',imageName); 
    var __dirname = 'resources/posters';
    var file = path.resolve(__dirname,imageName);
    var img = fs.readFileSync(file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');

  }

}).listen(8888);