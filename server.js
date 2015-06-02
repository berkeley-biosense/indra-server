var config = require('./config.js')
var restify = require('restify')
var bunyan = require('bunyan')
var log = bunyan.createLogger({name: config.logName})
var isValid = require('./indraSchemaValidator.js')

//couch
var couchdb = require('./couchdb.js')
var cradle = require('cradle')
// connect to couch
db = new(cradle.Connection)(config.dbHost, config.dbPort, {
    auth: { username: config.dbAdminUsername, password: config.dbAdminPassword }
  }).database(config.dbName)
// create db if it doesnt exist
db.exists(function (err, exists) {
  if (err) 
    log.warn('db error -> %s', err)
  if (exists) 
    log.info('db connected')
  if (!exists) {
    log.info('db not found, trying to create db')
    db.create(function (err) {
      log.warn('error creating db -> %s', err)
    })
  }
})

var server = restify.createServer({})
server.use(restify.bodyParser())
server.use(restify.CORS())
server.use(restify.fullResponse())

function handleRequest (req, res, next) {
  // valid data + a channel 
  // -> send 201 + save data to couch
  if (isValid(req.body)) {
    if (req.params.channel) {
      couchdb.append(db, req.body, req.params.channel)
      res.send(201)
      return next();
    }
    // no channel -> 400 BadRequestError
     else {
      log.warn('someone tried to post this no channel -> %s', req.body);
      return next(new restify.BadRequestError(config.badRequestErrorMessage));
    }
  }
  // bad data -> 422 UnprocessableEntityError
  else {
    log.warn('bad schema -> %s', JSON.stringify(req.body));
    return next(new restify.UnprocessableEntityError(config.unprocessableEntityErrorMessage));
  }
}

// lazily coded 'channels'
server.post('/post/:channel', handleRequest)

server.listen(config.port)
log.info('listening on %s', config.port)
