var config = require('./config.js')
var _ = require('lodash')
var cradle = require('cradle')
var restify = require('restify')
var Pusher = require('pusher')
var bunyan = require('bunyan')
var log = bunyan.createLogger({name: config.LOG_NAME})
var isSchemaValid = require('./indraSchemaValidator.js')

// create pusher server
var pusher = new Pusher({
  appId: config.PUSHER_APP_ID,
  key: config.PUSHER_KEY,
  secret: config.PUSHER_SECRET, 
  encrypted: config.IS_PUSHER_ENCRYPTED, // optional, defaults to false
  // host: 'HOST', // optional, defaults to api.pusherapp.com 
  // port: PORT, // optional, defaults to 80 for unencrypted and 443 for encrypted 
})

// connect to couch 
db = new(cradle.Connection)(config.DB_HOST, config.DB_PORT, {
    // secure: true,
    auth: { username: config.DB_ADMIN_USERNAME, password: config.DB_ADMIN_PASSWORD }
  }).database(config.DB_NAME)

// create couchdb if it doesnt exist
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

// sends data through pusherClient
function publish (pusherServer, data) {
  // all data sent over a channel called 'everything'
  pusherServer.trigger('everything'
    // data.type is the pusher event name
    , data.type
    , data);
}

// extends post with {createdAt: 'ISOString'} and saves it to db
function addCreatedAt (post) {
  var d = new Date()
  return _.extend(post, { createdAt: d.toISOString() })
}

// handles JSON post requests
function handleRequest (req, res, next) {
  // if valid json -> 
  if (isSchemaValid(req.body)) {
    data = addCreatedAt(req.body) // add createdAt field
    db.save(data)  // append data to couch db
    publish(pusher, data) // publish over pusher
    res.send(202) // send 202
    return next();
  }
  // bad data -> 422 UnprocessableEntityError
  log.warn('bad data schema -> %s', JSON.stringify(req.body));
  return next(
    new restify.UnprocessableEntityError(
      config.UNPROCESSABLE_ENTITY_ERROR_MESSAGE));
}

var server = restify.createServer({})
server.use(restify.bodyParser())
server.use(restify.CORS())
server.use(restify.fullResponse())

// JSON post request route is named /data/
server.post('/data/', handleRequest)

server.listen(config.PORT)
log.info('listening on %s', config.PORT)
