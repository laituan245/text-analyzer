var http = require('http');
var querystring = require('querystring');
var parser = require('xml2json');
var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
  application_id: "ae16ddc7",
  application_key: "5a430ba361e6c977dc7523d0e9a402e5"
});

function max(a , b) {
	if (a > b)
		return a;
	return b;
}

exports.index = function (req, res) {
    res.render('index');
};

exports.about = function (req, res) {
	res.render('about');
}

exports.classifybysubtopics = function(req, res) {
	var textdata = req.body.text;
	var topicname = req.body.topicname;
	if (topicname === 'Computers')
		topicname = 'Computer';
	if (topicname === 'Arts')
		topicname = 'Art';
	if (topicname === 'Games')
		topicname = 'Game';
	if (topicname === 'Sports')
		topicname = 'Sport';
	
	var classifierNames = topicname + '%20' + 'Topics';
	
	var options = {
		host: 'uclassify.com',
		path: '/browse/uClassify/' + classifierNames + '/ClassifyText?readkey=LYUHqDf3Jpjx&text=' + querystring.escape(textdata)
	}
	
	callback = function(response) {
		var str = '';
		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});
		
		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			str = parser.toJson(str);
			res.send({'success': true, 'payload': str});
		});
	}
	http.request(options, callback).end();		
}

exports.classify = function(req, res) {
	var textdata = req.body.text;
	var options = {
		host: 'uclassify.com',
		path: '/browse/uClassify/Topics/ClassifyText?readkey=LYUHqDf3Jpjx&text=' + querystring.escape(textdata)
	};
	
	callback = function(response) {
		var str = '';
		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});
		
		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			str = parser.toJson(str);
			res.send({'success': true, 'payload': str});
		});
	}
	
	http.request(options, callback).end();	
}


exports.summarize = function(req, res) {
    var textdata = req.body.text;
    var nbofdots = 0;
    for (var i = 0; i < textdata.length; i++)
		if (textdata[i] == '.')
			nbofdots += 1;
    textapi.summarize({
		title : 'My text document',
		text : textdata,
		sentences_number: max(1, parseInt(nbofdots/3))
	}, function(error, response) {
		if (error === null) {
			var textmode = 'tweet';
			if (textdata.length > 150)
				textmode = 'document';
			textapi.sentiment({
				text: textdata,
				mode: textmode
			}, function(error, anotherresponse) {
				res.send({'success': true, 
				'payload': JSON.stringify(response.sentences),
				'anotherpayload': JSON.stringify(anotherresponse)	
				});
			});
		}
	});
};