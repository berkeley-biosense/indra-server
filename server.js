var config          = require('./config.js')
var _               = require('lodash')
var restify         = require('restify')
var bunyan          = require('bunyan')
var log             = bunyan.createLogger({name: config.LOG_NAME})
var isSchemaValid   = require('./src/indraSchemaValidator.js')
var app             = require('http').createServer(handleRequest)
var socketio        = require('socket.io')
var fs              = require('fs')

// sends data through socket.io
function publish (data) {
  io.emit(data.type, data)
}

// extends post with {receivedAt: 'ISOString'} and saves it to db
function addReceivedAt (post) {
  var d = new Date()
  return _.extend(post, { receivedAt: d.toISOString() })
}

// handles JSON post requests
function handleRequest (req, res, next) {
  // if valid json -> 
  if (isSchemaValid(req.body)) {
    data = addReceivedAt(req.body) // add createdAt field
    publish(data) // publish over pusher
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

var io = socketio.listen(server.server);
io.sockets.on('connection', function (socket) {
  log.warn('client connected')
})

server.listen(config.PORT, function () {
  log.info('listening on %s', config.PORT)
})
