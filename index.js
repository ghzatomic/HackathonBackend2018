var express = require('express');
var bodyParser = require('body-parser')
var session = require('express-session')
var fs = require('fs');

var app = express();
var router = express.Router(); // Rotas

app.set('view engine', 'html'); // Renderizar html
app.set('views', './public'); // Renderizar html
app.engine('html', require('ejs').renderFile); //

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use('/', express.static('public'));

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});

app.get('/graficos/grafico_historico', function (req, res) {

  let labels = ["1","2","3"]
  let data = [5,6,7]
  let ret = {labels:labels,data:data}

  res.send(ret);
});