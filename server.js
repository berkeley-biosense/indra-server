var config = require('../config.js')
var _ = require('lodash')
var cradle = require('cradle')
var restify = require('restify')
var bunyan = require('bunyan')
var log = bunyan.createLogger({name: config.logName})
var isSchemaValid = require('./indraSchemaValidator.js')

// connect to couch db
db = new(cradle.Connection)(config.dbHost, config.dbPort, {
    // secure: true,
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

// extends post with {createdAt: 'ISOString'} and saves it to db
function append (db, post) {
  // add createdAt date to the object
  var d = new Date()
  var toSave = _.extend(post, { createdAt: d.toISOString() })
  // save the date
  db.save(toSave)
  return toSave
}

function handleRequest (req, res, next) {
  // valid json && a channel 
  // -> send 202 + save data to couch
  if (isSchemaValid(req.body)) {
    var savedData = append(db, req.body)
    res.send(202)
    return next();
  }
  // bad data -> 422 UnprocessableEntityError
  else {
    log.warn('bad data schema -> %s', JSON.stringify(req.body));
    return next(new restify.UnprocessableEntityError(config.unprocessableEntityErrorMessage));
  }
}

// setup server
var server = restify.createServer({})
server.use(restify.bodyParser())
server.use(restify.CORS())
server.use(restify.fullResponse())
// post request route is /data/
server.post('/data/', handleRequest)
// launch server
server.listen(config.port)
log.info('listening on %s', config.port)
