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
			res.send({'success': true, 
					  'payload': JSON.stringify(response.sentences)});
		}
	});
};