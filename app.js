var vision = require('node-cloud-vision-api')
vision.init({auth: 'AIzaSyCbDDuE_7XnbPTfJtMhgWWETzQTcnpKRlY'})

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path");

var visual_recognition = new VisualRecognitionV3({
  api_key: '513bbcd9cbce91d28ba03fd2492cde32f3b66f9a'/*'37745a59c469e745974eac39b50a52752a803887'*/,
  version_date: '2016-05-19'
});

var sponsors = ['ibm', 'facebook', 'google', 'apple', 'capital', 'one', 'chevron', 'hewlett', 'packard', 'indeed', 'mlh'];
var sponsorMessage = ['IBM', 'Facebook', 'Google', 'Apple', 'CapitalOne', 'CapitalOne', 'Chevron', 'HP', 'HP', 'Indeed','MLH'];

var matchedEntity_1 = '';
var matchedEntity_2 = '';
var matchedEntity_google_text = '';
var matchedEntity_google_logo = '';
var matchedEntity_google_face_joy = '';
var matchedEntity_google_face_sorrow = '';
var matchedEntity_google_face_anger = '';
var matchedEntity_google_face_surprise = '';

var params_test = {
  url: 'http://13.84.145.193:9000/static/img.jpg'//fs.createReadStream('./resources/images/test_3.jpg')
};

var count = 10;
var magicRatio = 1;

var tempInterval = setInterval(function(){
  if(count <= 1)
    clearInterval(tempInterval);
  else
    count = count - 1;

  getImageFromNest();

},15000);

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
    }else if(req.url == '/Women2.mp4'){
      videoName = 'Women2.mp4';
    }else if(req.url == '/Women.mp4'){
      videoName = 'Women.mp4';
    }else if(req.url == '/Neutral.mp4'){
      videoName = 'Neutral.mp4';
    }else if(req.url == '/Men.mp4'){
      videoName = 'Men.mp4';
    }else if(req.url == '/Men2.mp4'){
      videoName = 'Men2.mp4';
    }else{
      videoName = 'MLH.mp4';
    }

    //console.log('videoName',videoName);
 
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
    //console.log('imageName',imageName); 
    var __dirname = 'resources/posters';
    var file = path.resolve(__dirname,imageName);
    var img = fs.readFileSync(file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');

  }else{

    if(req.url == '/getMatchedEntity'){

      var responseBody = {
        matchedEntity_2: matchedEntity_2,
        matchedEntity_1: matchedEntity_1,
        matchedEntity_google_text:  matchedEntity_google_text,
        matchedEntity_google_logo: matchedEntity_google_logo,
        matchedEntity_google_face_joy: matchedEntity_google_face_joy,
        matchedEntity_google_face_sorrow: matchedEntity_google_face_sorrow, 
        matchedEntity_google_face_anger: matchedEntity_google_face_anger,
        matchedEntity_google_face_surprise: matchedEntity_google_face_surprise     
      };

      console.log('responseBody ',responseBody);

      matchedEntity_2 = '';
      matchedEntity_1 = '';
      matchedEntity_google_text = '';
      matchedEntity_google_logo = '';
      matchedEntity_google_face_joy = '';
      matchedEntity_google_face_sorrow = '';
      matchedEntity_google_face_anger = '';
      matchedEntity_google_face_surprise = '';

      res.writeHead(200, {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "X-Requested-With"});
      res.write(JSON.stringify(responseBody));
      res.end();      
    }
  }

}).listen(process.env.PORT||8888);

function callGoogleAPI(){
  //console.log('inside callGoogleAPI');
  // 2nd image of request is load from Web
  var req = new vision.Request({
    image: new vision.Image({
      url: 'http://13.84.145.193:9000/static/img.jpg'
    }),
    features: [
      new vision.Feature('FACE_DETECTION', 10),
      new vision.Feature('TEXT_DETECTION', 10),
      new vision.Feature('LOGO_DETECTION', 10),
      new vision.Feature('LABEL_DETECTION', 10),
    ]
  })

  // send single request
  vision.annotate(req).then((res) => {
    // handling response
    //console.log(JSON.stringify(res.responses))
    var resultObject = res.responses[0];
    if(resultObject.logoAnnotations){
      var logoAnnotation = resultObject.logoAnnotations;
      logoAnnotation.forEach(function(item,index){
        if(!matchedEntity_google_logo)
          matchedEntity_google_logo = item;
      });
      console.log('logoAnnotation',logoAnnotation);
    }
    if(resultObject.textAnnotations){
      var textAnnotation = resultObject.textAnnotations[0].description;
      sponsors.forEach(function(item,index){
        if(textAnnotation.toLowerCase().indexOf(item) > -1){
          if(!matchedEntity_google_text)
            matchedEntity_google_text = sponsorMessage[index];
        }        
      });
      console.log('textAnnotation Result',textAnnotation.split('\n'));
    }
    if(resultObject.faceAnnotations){
      var faceAnnotations = resultObject.faceAnnotations;
      faceAnnotations.forEach(function(item,index){
        matchedEntity_google_face_joy = matchedEntity_google_face_joy + ' :: ' + item.joyLikelihood;
        matchedEntity_google_face_sorrow = matchedEntity_google_face_sorrow + ' :: ' + item.sorrowLikelihood;
        matchedEntity_google_face_anger = matchedEntity_google_face_anger + ' :: ' + item.angerLikelihood;
        matchedEntity_google_face_surprise = matchedEntity_google_face_surprise + ' :: ' + item.surpriseLikelihood;
        if(item.length == (index+1)){
          console.log('matchedEntity_google_face_joy ',matchedEntity_google_face_joy);
          console.log('matchedEntity_google_face_sorrow ',matchedEntity_google_face_sorrow);
          console.log('matchedEntity_google_face_anger ',matchedEntity_google_face_anger);
          console.log('matchedEntity_google_face_surprise ',matchedEntity_google_face_surprise);
        }
      });
    }
  }, (e) => {
    console.log('Error: ', e)
  })
}

function recognizeFaces(parameters, recognizeTextResult){
  var maleAgeMapping = initializeAgeMapping();
  var femaleAgeMapping = initializeAgeMapping();
  var numberOfImages = 1;
  var maleNumber = 0;
  var femaleNumber = 0;

  visual_recognition.detectFaces(parameters, function (err, keywords) {
    if (err)
      console.log('error:', err);
    else{
      //console.log(JSON.stringify(keywords, null, 2));
      if(keywords.images_processed == numberOfImages){
        var faces = keywords.images[0].faces;
        faces.forEach(function(item,index){
          var gender = item.gender.gender;
          var avgAge = (item.age.max + item.age.min)/2;
          var tempIndex = '';
          if(gender == 'FEMALE'){
            femaleNumber = femaleNumber + 1;
            if(avgAge <= 20){
              tempIndex= femaleAgeMapping.indexOf('<=20');
              femaleAgeMapping[tempIndex] = femaleAgeMapping[tempIndex] + 1;
            }else if(21<= avgAge <= 40){
              tempIndex = femaleAgeMapping.indexOf('21-40');
              femaleAgeMapping[tempIndex] = femaleAgeMapping[tempIndex] + 1;
            }else if(41<= avgAge <= 60){
              tempIndex = femaleAgeMapping.indexOf('41-60');
              femaleAgeMapping[tempIndex] = femaleAgeMapping[tempIndex] + 1;
            }else if(avgAge >= 60){
              tempIndex = femaleAgeMapping.indexOf('>=61');
              femaleAgeMapping[tempIndex] = femaleAgeMapping[tempIndex] + 1;
            }
          }else{
            maleNumber = maleNumber + 1;
            if(avgAge <= 20){
              tempIndex = maleAgeMapping.indexOf('<=20');
              maleAgeMapping[tempIndex] = maleAgeMapping[tempIndex] + 1;
            }else if(21<= avgAge <= 40){
              tempIndex = maleAgeMapping.indexOf('21-40');
              maleAgeMapping[tempIndex] = maleAgeMapping[tempIndex] + 1;
            }else if(41<= avgAge <= 60){
              tempIndex = maleAgeMapping.indexOf('41-60');
              maleAgeMapping[tempIndex] = maleAgeMapping[tempIndex] + 1;
            }else if(avgAge >= 60){
              tempIndex = maleAgeMapping.indexOf('>=61');
              maleAgeMapping[tempIndex] = maleAgeMapping[tempIndex] + 1;
            }
          }
          if(faces.length == (index+1)){
            matchedEntity_1 = recognizeTextResult;
            magicRatio = maleNumber / (femaleNumber == 0 ? 1: femaleNumber);
            if(magicRatio < 0.5)
              matchedEntity_2 = 'Women2.mp4';
            else if(0.50 <= magicRatio < 1.0)
              matchedEntity_2 = 'Women.mp4';
            else if(1.0 <= magicRatio < 2.0)
              matchedEntity_2 = 'Neutral.mp4';
            else if(2.0 <= magicRatio < 3.0)
              matchedEntity_2 = 'Men.mp4';
            else if(magicRatio >= 3.0)
              matchedEntity_2 = 'Men2.mp4';
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
  var numberOfImages = 1;
  var matchingCompany = '';
  visual_recognition.recognizeText(parameters, function (err, keywords) {
    if (err)
      console.log('error:', err);
    else{
      //console.log(JSON.stringify(keywords, null, 2));
      if(keywords.images_processed == numberOfImages){
        var imageTextConsolidated = keywords.images[0].text;
        sponsors.forEach(function(item,index){
          if(!matchingCompany && imageTextConsolidated.indexOf(item) > -1){
            matchingCompany = sponsorMessage[index];
          }
          if((sponsors.length) == (index+1)){
            //console.log('matchingCompany',matchingCompany);
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
      //console.log(parsed);
      var imageUrl = parsed.imageurl;
      var parameters = {
        url: imageUrl
      };
      callGoogleAPI();
      recognizeText(parameters);
    });
  })
  // If any error has occured, log error to console
  .on('error', function(e) {
    console.log("Got error: " + e.message);
  });

  //recognizeText(params_test);
}
