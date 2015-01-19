'use strict';
//written by: Cagan Senturk for kanalapp.com

var http = require("http");
var superagent = require("superagent");

var kanalConfig = {
  url: 'https://www.kanalapp.com',
  channelId: < enter your channel id > ,
  token: < enter your api token >
}

var sendIndex = function sendIndex(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/html"
  });
  response.write("<h3>Using KanalApp to get exception notifications</h3>");
  response.write("<p>If you are done with Kanal channel setup, click <a href='try'>here </a>to test</p>");
}

var kanalNotify = function kanalNotify(err) {
  //one could do exception handling here as well
  superagent
    .post(kanalConfig.url + '/api/channels/' + kanalConfig.channelId + '/messages')
    .set('Authorization', 'Bearer ' + kanalConfig.token)
    .send({
      content: err
    })
    .end(function(res) {
      if (res.ok) {
        console.log('Success ' + JSON.stringify(res.body));
      } else {
        console.log('Error ' + res.text);
      }
    });
}

process.on('uncaughtException', function(err) {
  console.log('Caught unhandled exception: ' + err);
  kanalNotify(err);
});

http.createServer(function(request, response) {
  if (request.url === '/try') {
    throw ("A strange error happened in your server code. " +
      "I am not sending much details right now to not to upset you much.");
  } else {
    sendIndex(request, response);
  }
  response.end();
}).listen(8888);