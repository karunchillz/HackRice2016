var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path");

var visual_recognition = new VisualRecognitionV3({
  api_key: '37745a59c469e745974eac39b50a52752a803887',
  version_date: '2016-05-19'
});

var matchedEntity_1 = '';
var matchedEntity_2 = '';

var params_test = {
  url: 'http://13.84.145.193:9000/static/img.jpg'//fs.createReadStream('./resources/images/test_3.jpg')
};

var count = 5;
var magicRatio = 1;

var tempInterval = setInterval(function(){
  if(count <= 1)
    clearInterval(tempInterval);
  else
    count = count - 1;

  getImageFromNest();

},10000);

function recognizeFaces(parameters, recognizeTextResult){
  console.log('recognizeTextResult',recognizeTextResult);
  console.log('parameters',parameters);
  var maleAgeMapping = initializeAgeMapping();
  var femaleAgeMapping = initializeAgeMapping();
  var numberOfImages = 1;
  var maleNumber = 0;
  var femaleNumber = 0;

  visual_recognition.detectFaces(parameters, function (err, keywords) {
    if (err)
      console.log('error:', err);
    else{
      console.log(JSON.stringify(keywords, null, 2));
      if(keywords.images_processed == numberOfImages){
        var faces = keywords.images[0].faces;
        faces.forEach(function(item,index){
          var gender = item.gender.gender;
          var avgAge = (item.age.max + item.age.min)/2;
          if(gender == 'FEMALE'){
            femaleNumber = femaleNumber + 1;
            if(avgAge <= 20){
              var tempIndex = femaleAgeMapping.indexOf('<=20');
              femaleAgeMapping[tempIndex] = femaleAgeMapping[tempIndex] + 1;
            }else if(21<= avgAge <= 40){
              var tempIndex = femaleAgeMapping.indexOf('21-40');
              femaleAgeMapping[tempIndex] = femaleAgeMapping[tempIndex] + 1;
            }else if(41<= avgAge <= 60){
              var tempIndex = femaleAgeMapping.indexOf('41-60');
              femaleAgeMapping[tempIndex] = femaleAgeMapping[tempIndex] + 1;
            }else if(avgAge >= 60){
              var tempIndex = femaleAgeMapping.indexOf('>=61');
              femaleAgeMapping[tempIndex] = femaleAgeMapping[tempIndex] + 1;
            }
          }else{
            maleNumber = maleNumber + 1;
            if(avgAge <= 20){
              var tempIndex = maleAgeMapping.indexOf('<=20');
              maleAgeMapping[tempIndex] = maleAgeMapping[tempIndex] + 1;
            }else if(21<= avgAge <= 40){
              var tempIndex = maleAgeMapping.indexOf('21-40');
              maleAgeMapping[tempIndex] = maleAgeMapping[tempIndex] + 1;
            }else if(41<= avgAge <= 60){
              var tempIndex = maleAgeMapping.indexOf('41-60');
              maleAgeMapping[tempIndex] = maleAgeMapping[tempIndex] + 1;
            }else if(avgAge >= 60){
              var tempIndex = maleAgeMapping.indexOf('>=61');
              maleAgeMapping[tempIndex] = maleAgeMapping[tempIndex] + 1;
            }
          }
          if(faces.length == (index+1)){
            matchedEntity_1 = recognizeTextResult;
            magicRatio = maleNumber / femaleNumber;
            if(magicRatio < 0.6)
              matchedEntity_2 = 'Apple.mp4';
            else if(0.60 <= magicRatio <= 1.4)
              matchedEntity_2 = 'Chevron.mp4';
            else if(magicRatio > 1.4)
              matchedEntity_2 = 'CapitalOne.mp4';
          } 
        });
      }
    }
  });

}


function initializeAgeMapping(){
  var genderAgeMapping = [];
  genderAgeMapping.push('<=20',0);
  genderAgeMapping.push('21-40',0);
  genderAgeMapping.push('41-60',0);
  genderAgeMapping.push('>=61',0);
  return genderAgeMapping;
}

function recognizeText(parameters){
  console.log('recognizeText',parameters);
  var sponsors = ['apple', 'capital', 'one', 'chevron', 'facebook', 'google', 'hewlett', 'packard', 'ibm', 'indeed', 'mlh'];
  var sponsorMessage = ['Apple', 'CapitalOne', 'CapitalOne', 'Chevron', 'Facebook', 'Google', 'HP', 'HP', 'IBM', 'Indeed','MLH'];
  var numberOfImages = 1;
  var matchingCompany = '';
  visual_recognition.recognizeText(parameters, function (err, keywords) {
    if (err)
      console.log('error:', err);
    else{
      console.log(JSON.stringify(keywords, null, 2));
      console.log('keywords.images_processed',keywords.images_processed);
      if(keywords.images_processed == numberOfImages){
        var imageTextConsolidated = keywords.images[0].text;
        sponsors.forEach(function(item,index){
          console.log('item',item);
          if(!matchingCompany && imageTextConsolidated.indexOf(item) > -1){
            matchingCompany = sponsorMessage[index];
          }
          if((sponsors.length) == (index+1)){
            console.log('matchingCompany',matchingCompany);
            recognizeFaces(parameters,matchingCompany);
          }
        });

      }
    }
  });

}

function getImageFromNest(){

  http.get("http://13.84.145.193:9000", function(res) {
    var body = ''; // Will contain the final response
    // Received data is a buffer.
    // Adding it to our body
    res.on('data', function(data){
      body += data;
    });
    // After the response is completed, parse it and log it to the console
    res.on('end', function() {
      var parsed = JSON.parse(body);
      console.log(parsed);
      var imageUrl = parsed.imageurl;
      var parameters = {
        url: imageUrl
      };
      recognizeText(parameters);
    });
  })
  // If any error has occured, log error to console
  .on('error', function(e) {
    console.log("Got error: " + e.message);
  });

  //recognizeText(params_test);
}

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

  }else if(isImageRequest){

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

  }else{

    if(req.url == '/getMatchedEntity')
      res.end(matchedEntity_2+'-'+matchedEntity_1);
  }

}).listen(8888);