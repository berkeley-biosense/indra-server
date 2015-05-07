var restify = require('restify');
var database = require('./database.js')

port = 23023

//server
var server = restify.createServer({});
server.use(restify.bodyParser())

// allow CORS
server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
)

//db
// make sure test reading model is synced w db
database.syncNeuroskyReadingModel() 

app.post('/', function (req, res, next) {
  database.saveNeuroskyReading(req.body)
  res.end(200)
  return next();
})

server.listen(port)
console.log('listening on port ' + port)
