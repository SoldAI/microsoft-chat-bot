require('dotenv').config();
var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');
var qs = require('querystring');

//Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3987, function() {
    console.log('%s listening to %s', server.name, server.url);
});

//Create connector for comunicating with the bot Framework service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

//Liaten for messages from users
server.post('/api/messages', connector.listen());

//Receieve messages from the user and respond by echoing each message back
var bot = new builder.UniversalBot(connector, function(session) {
	var options = questionRequest(session.message.text);
    http.get(options, function(response) {
        var body = ''; // Will contain the final response
        response.on('data', function(data){ body += data; });
        response.on('end', function() {
            //console.log(body);
            var hermes_answer = JSON.parse(body);
            session.send(hermes_answer.respuesta);
    });
  }).on('error', function(e) {
    console.log("Got error while consulting hermes: " + e.message);
  });
});


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Demo Request
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function questionRequest(question) {
  var key = process.env.KEY;
  var path = process.env.HERMES_API_PATH + '?key=' + key + '&q=' + qs.escape(question);
  var options = {
    host: process.env.HERMES_HOST,
    port: '80',
    path: path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'access_token' : 'undefined'
    }
  };
  return options;
}
