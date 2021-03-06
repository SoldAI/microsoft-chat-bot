var builder = require('botbuilder');
require('dotenv').config();
var http = require('http');
var qs = require('querystring');


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Connector Instance
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector, function(session) {
    var options = questionRequest(session.message.text);
    http.get(options, function(response) {
        var body = ''; // Will contain the final response
        response.on('data', function(data){ body += data; });
        response.on('end', function() {
            var parsed = JSON.parse(body);
            session.send("Hermes:" + parsed.current_response.message);
    });
  }).on('error', function(e) {
    console.log("Got error while consulting hermes: " + e.message);
  });
});


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Example Request for the bot
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function questionRequest(question) {
  var key = process.env.KEY;
  var path = process.env.HERMES_API_PATH + '?key=' + key + '&question=' + qs.escape(question) + "&session_id=mysessid";
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
