var config = require('./config.js')
var restify = require('restify')
var Pusher = require('pusher')
var bunyan = require('bunyan')
var log = bunyan.createLogger({name: config.LOG_NAME})
//var isSchemaValid = require('./src/indraSchemaValidator.js')

// create pusher server
var pusher = new Pusher({
  appId: config.PUSHER_APP_ID,
  key: config.PUSHER_KEY,
  secret: config.PUSHER_SECRET, 
  encrypted: config.IS_PUSHER_ENCRYPTED, // optional, defaults to false
  // host: 'HOST', // optional, defaults to api.pusherapp.com 
  // port: PORT, // optional, defaults to 80 for unencrypted and 443 for encrypted 
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
//function addCreatedAt (post) {
//  var d = new Date()
//  return _.extend(post, { createdAt: d.toISOString() })
//}

// handles JSON post requests
function handleRequest (req, res, next) {
  // if valid json -> 
  if req.body.type {
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

// JSON post request route is named /
server.post('/', handleRequest)

server.listen(config.PORT)
log.info('listening on %s', config.PORT)
