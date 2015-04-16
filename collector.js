var app = require('express')()
var bodyParser = require('body-parser')

var database = require('./models.js')

//db
database.syncTestReadingModel() // make sure test reading model is synced w db

//server
app.use(bodyParser.json())

// allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.post('/', function (req, res) {
  database.saveTestReading(req.body)
  res.sendStatus(200)
})

var server = app.listen(23023)
