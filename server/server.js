var path = require("path");
var express = require("express");
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var compression = require("compression")
var _ = require("lodash")
var http = require("http")
var shortid = require('shortid');
var SocketIo = require('socket.io');



var env = {
  production: process.env.NODE_ENV === 'production'
};


var express = require('express');
var app = express();

const server = new http.Server(app);
const io = new SocketIo(server);
io.path('/ws');

app.use(compression())
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride())

var port = Number(process.env.PORT || 3000);

app.use("/", express.static(__dirname + '/../public'));
app.use("/landscape/public", express.static(__dirname + '/../public'));

if (!env.production) {
  var webpack = require("webpack");
  var webpackMiddleware = require("webpack-dev-middleware");
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var config = require("../webpack.dev.config.js");
  var compiler = webpack(config);

  app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }));

  app.use(webpackHotMiddleware(compiler));
} else {
  app.use("/static", express.static(__dirname + '/../dist'));
}

app.get('/page/:id', function(req, res) {
  res.render('index', {
    builderMode: "content-builder",
    pageId: req.params.id
  });
});

app.get('/form/:id', function(req, res) {
  res.render('index', {
    builderMode: "form-builder",
    pageId: req.params.id
  });
});

app.get('/form', function(req, res) {
  res.writeHead(302, {
    'Location': '/form/' + shortid.generate()
    //add other headers here...
  });
  res.end();
});

app.get('/landscape', function(req, res) {
  res.render('index', {
    builderMode: "landscape",
    pageId: "localStorage"
  });
});

app.get('*', function(req, res) {
  // res.render('index');
  res.writeHead(302, {
    'Location': '/page/' + shortid.generate()
    //add other headers here...
  });
  res.end();
});

var runnable = app.listen(port, function () {
  console.log('server running at localhost:' + port + ', go refresh and see magic');
});

// const runnable = app.listen(config.apiPort, (err) => {
//   if (err) {
//     console.error(err);
//   }
//   console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
//   console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
// });


var pages = {}

io.on('connection', function(socket) {
  var clientId = shortid()
  console.log("client is here !", clientId)
  
  socket.emit('news', {msg: `'Hello World!' from server`});

  socket.on('register', (data) => {
    var pageId = data.pageId
    if (!pages[pageId]){
      console.log("register new page", pageId)
      pages[pageId] = {
        pageId: pageId,
        clients: [{
          clientId: clientId,
          socket: socket
        }],
        messages: []
      }
      
      socket.emit("pb-init",{pageId: pageId})
    } else {
      var page = pages[pageId]
      console.log("we already have a page", page)
      
      // Register new client
      page.clients.push({
        clientId: clientId,
        socket: socket
      })
      
      // Push info to client...
      page.messages.forEach(function(msg){
        socket.emit(msg.op, msg.data)
      })
    }
    
    function pushOrMerge(messages, message){
      if ((message.op == 'pb-update') && (messages.length > 0)) {
        var prevMsg = messages[messages.length-1];
        if ((prevMsg.op == 'pb-update') 
          && (prevMsg.data.widgetId == message.data.widgetId) 
          && (prevMsg.data.key == message.data.key)) {
          messages.pop(); // Remove previous one
        }
      }
      messages.push(message)
    }
    
    function bind(op){
      console.log("bind", op)
      socket.on(op, function(data) {
        console.log("on", op, data)
        var page = pages[pageId]
        console.log("page", pageId, page)
        pushOrMerge(page.messages, {
          op: op, data: data
        })
        page.clients.forEach(function(client){
          if (client.clientId != clientId){
            client.socket.emit(op, data)
          }
        })
      });
    }

    bind('pb-add');
    bind('pb-move');
    bind('pb-update');
    bind('pb-remove');
  });
});
io.listen(runnable);
