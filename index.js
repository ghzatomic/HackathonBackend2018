var express = require('express');
var bodyParser = require('body-parser')
var session = require('express-session')
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://ds229549.mlab.com:29549';
const user = encodeURIComponent('develop');
const password = encodeURIComponent('d3v3l0p');
const authMechanism = 'DEFAULT';
// Database Name
const dbName = 'heroku_8238c67h';


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


// Create a new MongoClient
const client = new MongoClient(url);

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});


app.get('/graficos/grafico_historico', function (req, res) {

  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Banco conectado !");

    const db = client.db(dbName);

    /*const collection = db.collection('historico');

    collection.find({'a': 3}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");

      let labels = ["1","2","3"]
      let data = [5,6,7]
      let ret = {labels:labels,data:data}

      res.send(ret);

    });*/

    let labels = ["1","2","3"]
    let data = [5,6,7]
    let ret = {labels:labels,data:data}

    res.send(ret);

    client.close();
  });


});