/* Import node's http module: */
var handleRequest = require('./request-handler.js').requestHandler;
var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();
// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.
var port = 3000;

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
var ip = '127.0.0.1';

app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/../client/index.html');
});

app.get('/classes/messages', function(req, res) {
  fs.readFile(__dirname + '/messages.json', 'utf8', (err, data) => {
    if (err) {
      console.log('no messages');
    }
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({results: JSON.parse(data)}));
  });
});

app.post('/classes/messages', function(req, res) {
  req.on('data', (dataChunck) => {
    fs.readFile(__dirname + '/messages.json', 'utf8', (err, data) => {
      if (err) {
        console.log('no messages');
      }
      data = JSON.parse(data);
      data.unshift(JSON.parse(dataChunck));
      fs.writeFile(__dirname + '/messages.json', JSON.stringify(data), (err) => {
        if (err) {
          throw err;
        }
        console.log('It\'s saved!');
      });
      res.send(JSON.stringify(data));
    });
  });
});
// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//
// After creating the server, we will tell it to listen on the given port and IP. */
var server = http.createServer(app).listen(port, ip);
console.log('Listening on http://' + ip + ':' + port);

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.

