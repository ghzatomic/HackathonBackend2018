var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser')
var session = require('express-session')
var fs = require('fs');
//const mongoose = require('mongoose');
//const NumberInt = require('mongoose-int32');
const assert = require('assert');

// Connection URL
const user = encodeURIComponent('develop');
const password = encodeURIComponent('d3v3l0p');
const authMechanism = 'DEFAULT';
// Database Name
const dbName = 'heroku_8238c67h';
//const url = 'mongodb://'+user+':'+password+'@ds229549.mlab.com:29549/authMechanism='+authMechanism+'&authSource='+dbName;
const url = 'mongodb://'+user+':'+password+'@ds229549.mlab.com:29549/'+dbName;

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
  res.setHeader('Access-Control-Allow-Origin', '*');

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
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);



app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});






app.get('/graficos/data_sentimento/:id', function (req, res) {

  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Banco conectado !");

    const db = client.db(dbName);

    const collection = db.collection('gob_messages');

    collection.aggregate(
        [
          {
            "$match" : {
              "user_id" : req.params.id
            }
          },
          {
            "$group" : {
              "_id" : {
                "datetime" : {$dateToString: { format: "%Y-%m-%d-%H-%M", date: "$datetime" }},
                "sentiment" : "$sentiment"
              },
              "COUNT(sentiment)" : {
                "$sum" : 1
              }
            }
          },
          {
            "$project" : {
              "_id" : 0,
              "datetime" : "$_id.datetime",
              "sentiment" : "$_id.sentiment",
              "sentimentCount" : "$COUNT(sentiment)"
            }
          },
          {
            "$sort" : {
              "datetime" : 1
            }
          }
        ],
        {
          "allowDiskUse" : true
        }
    ).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      let labels = []
      let dataNeutro = []
      let dataPositivo = []
      let dataNegativo = []

      var grouped = _.mapObject(_.groupBy(docs, "datetime"),
          clist => clist.map(docs => _.omit(docs, "datetime")));

      Object.keys(grouped).forEach(function(dataKey){
        console.log(dataKey)
        const internalData = grouped[dataKey]
        const positivo = internalData.filter(function(v){ return v["sentiment"] == "positivo"; });
        const negativo = internalData.filter(function(v){ return v["sentiment"] == "negativo"; });
        const neutro = internalData.filter(function(v){ return v["sentiment"] == "neutro"; });

        if (positivo.length == 0){
          dataPositivo.push(0);
        }else{
          dataPositivo.push(positivo[0].sentimentCount);
        }

        if (negativo.length == 0){
          dataNegativo.push(0);
        }else{
          dataNegativo.push(negativo[0].sentimentCount);
        }

        if (neutro.length == 0){
          dataNeutro.push(0);
        }else{
          dataNeutro.push(neutro[0].sentimentCount);
        }
        labels.push(dataKey);
      });


      let ret = {labels:labels,data:[dataPositivo,dataNegativo,dataNeutro]}

      res.send(ret);

    });



  });

});


app.get('/graficos/grafico_sentimentos/:id', function (req, res) {

  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Banco conectado !");

    const db = client.db(dbName);

    const collection = db.collection('gob_messages');

    collection.aggregate(
        [
          {
            "$match" : {
              "user_id" : req.params.id
            }
          },
          {
            "$group" : {
              "_id" : {
                "sentiment" : "$sentiment"
              },
              "COUNT(sentiment)" : {
                "$sum" : 1
              }
            }
          },
          {
            "$project" : {
              "_id" : 0,
              "sentiment" : "$_id.sentiment",
              "COUNT(sentiment)" : "$COUNT(sentiment)"
            }
          }
        ],
        {
          "allowDiskUse" : true
        }
    ).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      let labels = []
      let dados = []
      docs.forEach(function(data){
        labels.push(data[Object.keys(data)[0]]);
        dados.push(data[Object.keys(data)[1]]);
      });


      let ret = {labels:labels,data:dados}

      res.send(ret);

    });



  });
  //client.close();

});




app.get('/usuarios', function (req, res) {

  client.connect(function(err) {
    assert.equal(null, err);

    const db = client.db(dbName);

    const collection = db.collection('gob_user');

    collection.find({}
    ).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      let labels = []
      let dados = []
      docs.forEach(function(data){
        dados.push(data['user_id']);
        labels.push(data['nome']);
      });


      let ret = {labels:labels,data:dados}

      res.send(ret);

    });



  });
  //client.close();

});